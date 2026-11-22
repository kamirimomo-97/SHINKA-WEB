import {ENVIRONMENT} from './app-environment.js?v=0.60.5';
import {createDemo,advanceDays,workout} from './rank-system.js?v=0.60.5';
import {rankForLevel} from './rank-banner.js?v=0.60.5';
import {playerLevel} from './progression.js?v=0.60.5';
import {localDate,addDate,distance,DECAY} from './rank-system.js?v=0.60.5';
import {metrics} from './core.js?v=0.60.5';
export const PRIME_MIGRATION_BACKUP='shinka-rank-before-prime-v1';
export const RANK_MIGRATION_BACKUP='shinka-rank-before-rules-v1';
export function trainingDates(db,timeZone){return [...new Set((db.sessions||[]).filter(s=>Number.isFinite(s.finished)&&metrics(s).sets>0).map(s=>localDate(s.finished,timeZone)))].sort();}
function decay(s,to,inclusive=true){while(s.rank>3){const next=addDate(s.decayAt,DECAY[s.rank]);if(next>to||(!inclusive&&next===to))break;s.decayAt=next;s.partial=0;if(s.gems>0)s.gems--;if(s.gems===0){s.rank--;s.gems=5;}}}
function training(s,date){if(date>=s.decayAt){decay(s,date,false);s.decayAt=date;}if(!s.lastValidDate||date>s.lastValidDate)s.lastValidDate=date;if(s.gems===5&&s.rank<6){s.rank++;s.gems=0;s.partial=0;}else if(s.gems<5){s.partial++;if(s.partial===s.rank+1){s.partial=0;s.gems++;}}}
function livePrimeCalendar(old,dates,today,timeZone){
 const calendar=old.primeCalendar;if(today<calendar.date)return {...old};
 const sim=Object.assign(createDemo({date:calendar.date,timeZone}),{rank:old.rank,gems:old.gems,partial:old.partial,decayAt:old.decayAt,days:[...old.processedDates],eligibleSince:calendar.eligibleSince,streak:calendar.streak,prime:calendar.prime,history:calendar.history.map(h=>({...h}))});
 const known=new Set(old.processedDates),pending=dates.filter(d=>!known.has(d));
 for(const date of pending.filter(d=>d<=sim.date)){const current=sim.date,previousDecay=sim.decayAt,wasEligible=sim.eligibleSince;sim.date=date;workout(sim);sim.date=current;if(sim.decayAt<previousDecay)sim.decayAt=previousDecay;if(wasEligible===null&&sim.eligibleSince!==null)sim.eligibleSince=current;}
 const training=new Set(pending);while(sim.date<today)advanceDays(sim,1,training.has(addDate(sim.date,1)));
 return {version:1,rank:sim.rank,gems:sim.gems,partial:sim.partial,decayAt:sim.decayAt,lastValidDate:[...old.processedDates,...pending].sort().at(-1)||null,timeZone,processedDates:[...new Set([...old.processedDates,...pending])].sort(),primeCalendar:{date:sim.date,eligibleSince:sim.eligibleSince,streak:sim.streak,prime:sim.prime,history:sim.history}};
}
export function calculateRankProgress(db,now=Date.now()){const old=db.rankProgress,timeZone=old?.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Rome',today=localDate(now,timeZone),dates=trainingDates(db,timeZone).filter(d=>d<=today);let state;
 if(old?.primeCalendar)return livePrimeCalendar(old,dates,today,timeZone);
 if(old){state={...old,processedDates:[...old.processedDates]};const known=new Set(state.processedDates);for(const d of dates)if(!known.has(d)){training(state,d);known.add(d);}state.processedDates=[...known].sort();}
 else{const initial=rankForLevel(playerLevel(db)),last=dates.at(-1)||null;state={version:1,rank:initial.rank,gems:initial.gems,partial:initial.gems===5?0:(initial.level-[0,6,17,33,54,80,111][initial.rank])%(initial.rank+1),decayAt:last||today,lastValidDate:last,timeZone,processedDates:dates};}
 decay(state,today);state.primeCalendar={date:today,eligibleSince:state.rank===6&&state.gems===5?today:null,streak:0,prime:false,history:[]};return state;}
export function activeRank(db,level=playerLevel(db)){if(ENVIRONMENT==='administrator'&&db.demoMax?.rank!==undefined)return {rank:db.demoMax.rank,gems:db.demoMax.gems,prime:!!db.demoMax.prime,weeks:db.demoMax.weeks||0,level};if(db.demoMax||!db.rankProgress)return rankForLevel(level);return {rank:db.rankProgress.rank,gems:db.rankProgress.gems,partial:db.rankProgress.partial,prime:!!db.rankProgress.primeCalendar?.prime,weeks:db.rankProgress.primeCalendar?.prime?(db.rankProgress.primeCalendar.history.at(-1)?.weeks||0):0,level};}
export function syncRankProgress(db,storage,now=Date.now(),initialRaw=null){if(db.demoMax)return false;const next=calculateRankProgress(db,now);if(JSON.stringify(next)===JSON.stringify(db.rankProgress))return false;const raw=initialRaw||storage.getItem('shinka-lab-v1');if(!db.rankProgress&&raw&&!storage.getItem(RANK_MIGRATION_BACKUP))storage.setItem(RANK_MIGRATION_BACKUP,raw);if(db.rankProgress&&!db.rankProgress.primeCalendar&&raw&&!storage.getItem(PRIME_MIGRATION_BACKUP))storage.setItem(PRIME_MIGRATION_BACKUP,raw);const previous=db.rankProgress;db.rankProgress=next;try{storage.setItem('shinka-lab-v1',JSON.stringify(db));}catch(error){if(previous===undefined)delete db.rankProgress;else db.rankProgress=previous;throw error;}return true;}
