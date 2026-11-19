import {rankForLevel} from './rank-banner.js';
import {playerLevel} from './progression.js';
import {localDate,addDate,distance,DECAY} from './rank-system.js';
import {metrics} from './core.js';
export const RANK_MIGRATION_BACKUP='shinka-rank-before-rules-v1';
export function trainingDates(db,timeZone){return [...new Set((db.sessions||[]).filter(s=>Number.isFinite(s.finished)&&metrics(s).sets>0).map(s=>localDate(s.finished,timeZone)))].sort();}
function decay(s,to,inclusive=true){while(s.rank>3){const next=addDate(s.decayAt,DECAY[s.rank]);if(next>to||(!inclusive&&next===to))break;s.decayAt=next;s.partial=0;if(s.gems>0)s.gems--;if(s.gems===0){s.rank--;s.gems=5;}}}
function training(s,date){if(date>=s.decayAt){decay(s,date,false);s.decayAt=date;}if(!s.lastValidDate||date>s.lastValidDate)s.lastValidDate=date;if(s.gems===5&&s.rank<6){s.rank++;s.gems=0;s.partial=0;}else if(s.gems<5){s.partial++;if(s.partial===s.rank+1){s.partial=0;s.gems++;}}}
export function calculateRankProgress(db,now=Date.now()){const old=db.rankProgress,timeZone=old?.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Rome',today=localDate(now,timeZone),dates=trainingDates(db,timeZone).filter(d=>d<=today);let state;
 if(old){state={...old,processedDates:[...old.processedDates]};const known=new Set(state.processedDates);for(const d of dates)if(!known.has(d)){training(state,d);known.add(d);}state.processedDates=[...known].sort();}
 else{const initial=rankForLevel(playerLevel(db)),last=dates.at(-1)||null;state={version:1,rank:initial.rank,gems:initial.gems,partial:initial.gems===5?0:(initial.level-[0,6,17,33,54,80,111][initial.rank])%(initial.rank+1),decayAt:last||today,lastValidDate:last,timeZone,processedDates:dates};}
 decay(state,today);return state;}
export function activeRank(db,level=playerLevel(db)){if(db.demoMax||!db.rankProgress)return rankForLevel(level);return {rank:db.rankProgress.rank,gems:db.rankProgress.gems,partial:db.rankProgress.partial,level};}
export function syncRankProgress(db,storage,now=Date.now(),initialRaw=null){if(db.demoMax)return false;const next=calculateRankProgress(db,now);if(JSON.stringify(next)===JSON.stringify(db.rankProgress))return false;const raw=initialRaw||storage.getItem('shinka-lab-v1');if(!db.rankProgress&&raw&&!storage.getItem(RANK_MIGRATION_BACKUP))storage.setItem(RANK_MIGRATION_BACKUP,raw);const previous=db.rankProgress;db.rankProgress=next;try{storage.setItem('shinka-lab-v1',JSON.stringify(db));}catch(error){if(previous===undefined)delete db.rankProgress;else db.rankProgress=previous;throw error;}return true;}
