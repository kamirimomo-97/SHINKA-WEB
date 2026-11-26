import {isProgressionTraining} from './training-validity.js?v=0.60.8';
import {validTitlesState} from './title-state.js?v=0.60.8';
import {FAMILY_LABELS} from './title-exercises.js?v=0.60.8';
import {validRankProgress} from './rank-state-validation.js?v=0.60.8';
import {creatureKeys} from './creature-catalog.js?v=0.60.8';
import {appearancePalettes} from './avatar-appearance.js?v=0.60.8';
import {avatarParts,legacyAvatarParts} from './avatar-catalog.js?v=0.60.8';
export const TYPES=['normale','warmup','top','backoff','drop'];
export function timerSeconds(timer,now=Date.now()){if(!timer)return 0;if(typeof timer==='object'&&timer.paused)return Math.max(0,Math.ceil(timer.remaining));return Math.max(0,Math.ceil((timer-now)/1000));}
export function adjustTimer(timer,delta,now=Date.now()){if(typeof timer==='object'&&timer?.paused)return {...timer,remaining:Math.min(3600,Math.max(0,timer.remaining+delta))};return now+Math.min(3600,Math.max(0,timerSeconds(timer,now)+delta))*1000;}
export function loadWeight(ex,kg){if(ex.loadMode==='per-hand')return kg*(ex.handCount||2);if(ex.loadMode==='assisted')return Number.isFinite(ex.bodyMass)&&ex.bodyMass>0?Math.max(0,ex.bodyMass-kg):0;if(ex.loadMode==='bodyweight')return Number.isFinite(ex.bodyMass)&&ex.bodyMass>0?ex.bodyMass+kg:0;return kg;}
export function setVolume(ex,s){return loadWeight(ex,s.kg)*s.reps+(s.type==='drop'?(s.segments||[]).reduce((a,z)=>a+loadWeight(ex,z.kg)*z.reps,0):0);}
export function comparisonKey(e){return JSON.stringify([e.id,e.loadMode||'total',e.equipment||'',e.loadMode==='per-hand'?e.handCount||2:1]);}
export function metrics(session){let volume=0,sets=0,muscles=Object.create(null);for(const ex of session.exercises){for(const s of ex.sets){if(!s.done||s.type==='warmup')continue;sets++;let v=setVolume(ex,s);volume+=v;muscles[ex.muscle]=(muscles[ex.muscle]||0)+v;}}return {volume,sets,muscles:{...muscles}};}
export function strength(sessions,id){return sessions.flatMap(s=>s.exercises.filter(e=>e.id===id&&!['assisted','bodyweight'].includes(e.loadMode)).flatMap(e=>e.sets.filter(x=>x.done&&x.type!=='warmup'&&x.reps>0&&x.reps<=12&&x.kg>0).map(x=>({date:s.finished,value:loadWeight(e,x.kg)*(1+x.reps/30)}))));}
export function rewards(sessions){const days=new Set(sessions.filter(s=>isProgressionTraining(s)).map(s=>s.day));return {xp:days.size*100,affinity:Math.min(100,days.size*5)};}
export function localDay(time=Date.now()){const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function periodSessions(sessions,days=28,now=Date.now()){if(!days)return [...sessions].sort((a,b)=>a.finished-b.finished);const cutoff=new Date(now);cutoff.setHours(0,0,0,0);cutoff.setDate(cutoff.getDate()-days+1);return sessions.filter(s=>s.finished>=cutoff.getTime()&&s.finished<=now).sort((a,b)=>a.finished-b.finished);}
export function muscleTotals(sessions){const result=Object.create(null);for(const session of sessions)for(const ex of session.exercises)for(const s of ex.sets){if(!s.done||s.type==='warmup')continue;const v=setVolume(ex,s);const m=result[ex.muscle]??={volume:0,sets:0,secondary:0};m.volume+=v;m.sets++;for(const secondary of new Set(ex.secondary||[])){if(secondary===ex.muscle)continue;const other=result[secondary]??={volume:0,sets:0,secondary:0};other.secondary++;}}return result;}
export function strengthBySession(sessions,id){const sorted=[...sessions].sort((a,b)=>a.finished-b.finished);const latest=sorted.flatMap(s=>s.exercises).filter(e=>e.id===id).at(-1);if(!latest)return [];return sorted.flatMap(s=>{const a=strength([{...s,exercises:s.exercises.filter(e=>comparisonKey(e)===comparisonKey(latest))}],id);return a.length?[{date:s.finished,value:Math.max(...a.map(x=>x.value)),id:s.id}]:[];});}
export function previousExercise(sessions,id){for(const session of [...sessions].sort((a,b)=>b.finished-a.finished)){const exercise=session.exercises.find(e=>e.id===id&&e.sets.some(s=>s.done));if(exercise)return {session,exercise};}return null;}
export function coachSuggestions(db){const out=[];if(!db.plans.length)out.push({id:'start',kind:'info',title:'Parti dalla tua prima scheda',reason:'Non hai ancora una scheda salvata. Scegli gli esercizi che conosci e definisci le serie.'});if(db.active?.readiness==='affaticato'&&db.active.mode!=='Recovery')out.push({id:'recovery',kind:'mode',title:'Considera la modalità Recovery',reason:'Hai indicato di sentirti affaticato. Recovery è un promemoria: non modifica automaticamente carichi o serie.',before:db.active.mode,after:'Recovery',activeId:db.active.id});
for(const plan of db.plans)for(const [index,e] of plan.exercises.entries()){if(['assisted','bodyweight'].includes(e.loadMode))continue;const compatible=db.sessions.map(s=>({...s,exercises:s.exercises.filter(x=>comparisonKey(x)===comparisonKey(e))}));const previous=previousExercise(compatible,e.id);if(!previous)continue;const sets=previous.exercise.sets.filter(s=>s.done&&s.type==='normale');const prescribed=e.sets.filter(s=>s.type==='normale');const upper=e.repMax,step=e.increment;if(!prescribed.length||sets.length<prescribed.length||!Number.isFinite(upper)||!Number.isFinite(step)||step<=0)continue;if(prescribed.some(s=>s.kg<=0)||!prescribed.every(s=>s.kg===prescribed[0].kg))continue;const work=sets.slice(0,prescribed.length);if(!work.every(s=>s.kg===prescribed[0].kg&&s.reps>=upper&&((typeof s.rir==='number'||typeof s.rpe==='number')&&(typeof s.rir!=='number'||s.rir>=2)&&(typeof s.rpe!=='number'||s.rpe<=8))))continue;out.push({id:`load:${plan.id}:${index}`,kind:'load',planId:plan.id,index,exerciseId:e.id,title:`Valuta il prossimo carico · ${e.name}`,reason:`Nell’ultima seduta hai completato almeno ${upper} ripetizioni nelle serie normali previste, con RIR ≥ 2 o RPE ≤ 8. L’incremento è quello che hai impostato tu: ${step} kg. Conferma solo se tecnica e recupero sono adeguati.`,before:prescribed[0].kg,after:Math.round((prescribed[0].kg+step)*100)/100,planFingerprint:JSON.stringify(plan)});}
if(!out.length)out.push({id:'observe',kind:'info',title:'Prima i dati, poi le proposte',reason:'Non emerge una modifica dalle regole attuali. Imposta intervallo ripetizioni e incremento nelle schede; registra RIR o RPE per abilitare il confronto. Nessun aumento basato solo sugli XP.'});return out;}
export function applySuggestion(db,s){if(s.kind==='mode'){if(db.active?.id!==s.activeId||db.active.mode!==s.before)throw Error('La sessione è cambiata: rivaluta il consiglio.');db.active.mode=s.after;return;}if(s.kind==='load'){const p=db.plans.find(p=>p.id===s.planId);if(!p||JSON.stringify(p)!==s.planFingerprint)throw Error('La scheda è cambiata: rivaluta il consiglio.');p.exercises[s.index].sets.filter(x=>x.type==='normale').forEach(x=>x.kg=s.after);return;}throw Error('Consiglio senza modifiche applicabili');}
export function validate(data){
 const fail=message=>{throw Error(message)}, str=(v,max=200)=>typeof v==='string'&&v.length<=max;
 const num=(v,min=0,max=1e9)=>Number.isFinite(v)&&v>=min&&v<=max;
 const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_:-]{1,120}$/.test(v);
 if(!data||data.version!==1||!Array.isArray(data.plans)||!Array.isArray(data.sessions)||!Array.isArray(data.library)||!creatureKeys.includes(data.starter))fail('Backup non compatibile');
 if(data.plans.length>1000||data.sessions.length>10000||data.library.length>2000)fail('Backup troppo grande');
 const checkEx=e=>{
  if(e?.achievementFamily!==undefined&&!Object.hasOwn(FAMILY_LABELS,e.achievementFamily))fail('Famiglia esercizio non valida');
  if(!e||!str(e.name)||!id(e.id)||!str(e.muscle)||!Array.isArray(e.sets)||e.sets.length>500)fail('Esercizio non valido');
  for(const [key,min,max] of [['rest',5,3600],['repMin',1,1000],['repMax',1,1000],['increment',0,100]])if(e[key]!==undefined&&!num(e[key],min,max))fail('Impostazione esercizio non valida');
  if(e.loadMode!==undefined&&!['total','per-hand','assisted','bodyweight'].includes(e.loadMode))fail('Convenzione di carico non valida');
  if(e.handCount!==undefined&&![1,2].includes(e.handCount))fail('Conteggio manubri non valido');
  if(e.bodyMass!==undefined&&!num(e.bodyMass,1,500))fail('Peso corporeo non valido');
  if(e.secondary!==undefined&&(!Array.isArray(e.secondary)||e.secondary.length>12||e.secondary.some(x=>!str(x,100))))fail('Muscoli secondari non validi');
  for(const key of ['equipment','instructions'])if(e[key]!==undefined&&!str(e[key],5000))fail('Descrizione non valida');
  for(const s of e.sets){
   if(!s||!TYPES.includes(s.type)||!num(s.kg,0,10000)||!num(s.reps,0,1000)||!Number.isInteger(s.reps)||typeof s.done!=='boolean'||!Array.isArray(s.segments)||s.segments.length>100||s.segments.some(x=>!x||!num(x.kg,0,10000)||!num(x.reps,0,1000)||!Number.isInteger(x.reps)))fail('Serie non valida');
   if(s.rest!==undefined&&!num(s.rest,5,3600))fail('Recupero non valido');
   if(s.rir!==undefined&&s.rir!==''&&!num(s.rir,0,10))fail('RIR non valido');
   if(s.rpe!==undefined&&s.rpe!==''&&!num(s.rpe,1,10))fail('RPE non valido');
   if(s.note!==undefined&&!str(s.note,10000))fail('Nota non valida');
  }
 };
 for(const p of [...data.plans,...data.sessions,...(data.active?[data.active]:[]),...(data.draft?[data.draft]:[])]){
  if(!p||!id(p.id)||!str(p.name)||!Array.isArray(p.exercises)||p.exercises.length>200)fail('Scheda non valida');
  if(p.trainingRuleVersion!==undefined&&p.trainingRuleVersion!==2)fail('Regola allenamento non valida');
  if(p.note!==undefined&&!str(p.note,10000))fail('Nota scheda non valida');
  p.exercises.forEach(checkEx);
 }
 for(const s of data.sessions)if(!num(s.finished,0,1e14)||!str(s.day,30))fail('Sessione non valida');
 if(data.active&&(!num(data.active.started,0,1e14)||!num(data.active.rest,5,3600)||!['Recovery','Standard','Godzilla'].includes(data.active.mode)))fail('Sessione attiva non valida');
 if(data.timer!==null&&data.timer!==undefined&&!num(data.timer,0,1e14)&&!(data.timer?.paused===true&&num(data.timer.remaining,0,3600)))fail('Timer non valido');
 for(const list of [data.plans,data.sessions,data.library]){const ids=new Set();for(const item of list){if(!id(item.id)||ids.has(item.id))fail('Identificatore duplicato o non valido');ids.add(item.id);}}
 for(const e of data.library)if((e.achievementFamily!==undefined&&!Object.hasOwn(FAMILY_LABELS,e.achievementFamily))||!str(e.name)||!id(e.id)||!str(e.muscle))fail('Libreria non valida');
 if(data.titles!==undefined&&!validTitlesState(data.titles,{allowSandbox:data.shinkaEnvironment==='administrator'&&data.demoMax?.titlesUnlocked!==false}))fail('Collezione titoli non valida');
 if(data.rankProgress!==undefined&&!validRankProgress(data.rankProgress))fail('Progressione rank non valida');
 if(data.trainerBadge!==undefined&&(!data.trainerBadge||Array.isArray(data.trainerBadge)||!['origin','silver','aurora','obsidian'].includes(data.trainerBadge.style)||Object.keys(data.trainerBadge).some(k=>k!=='style')))fail('Targhetta non valida');
 if(data.athlete&&(!str(data.athlete.name,60)||!str(data.athlete.goal,160)||!num(data.athlete.weeklyTarget,1,7)||!Number.isInteger(data.athlete.weeklyTarget)))fail('Profilo non valido');
 if(data.avatar!==undefined&&(!data.avatar||!['male','female'].includes(data.avatar.model)||!['basic','technical','hoodie'].includes(data.avatar.outfit)))fail('Avatar non valido');
 if(data.avatar)for(const [field,choices] of Object.entries(appearancePalettes))if(data.avatar[field]!==undefined&&!Object.hasOwn(choices,data.avatar[field]))fail('Colore avatar non valido');
 if(data.avatar?.gallery!==undefined){const g=data.avatar.gallery;if(!g||!/^0[1-9]$|^10$/.test(g.id)||!['neutral','fire','water','nature','wind','earth','lightning','shadow','ice','light'].includes(g.element))fail('Selezione avatar non valida');}
 if(data.avatar?.hairStyle!==undefined&&!['classic','curly','side','bald'].includes(data.avatar.hairStyle))fail('Taglio avatar non valido');
 if(data.avatar?.parts!==undefined){const parts=data.avatar.parts;if(!parts||typeof parts!=='object'||Array.isArray(parts)||Object.keys(parts).some(slot=>!Object.hasOwn(legacyAvatarParts,slot))||Object.entries(legacyAvatarParts).some(([slot,choices])=>!Object.hasOwn(choices,parts[slot])))fail('Indumenti avatar non validi');}
 if(data.avatar?.styleVersion!==undefined&&data.avatar.styleVersion!==3)fail('Versione avatar non valida');
 if(data.avatar?.styleVersion===3&&data.avatar.modules===undefined)fail('Blocchi avatar mancanti');
 if(data.avatar?.modules!==undefined){const parts=data.avatar.modules;if(data.avatar.styleVersion!==3||!parts||typeof parts!=='object'||Array.isArray(parts)||Object.keys(parts).some(slot=>!Object.hasOwn(avatarParts,slot))||Object.entries(avatarParts).some(([slot,choices])=>!Object.hasOwn(choices,parts[slot])))fail('Blocchi avatar non validi');}
 if(data.coachLog!==undefined&&(!Array.isArray(data.coachLog)||data.coachLog.length>10000||data.coachLog.some(l=>!l||!str(l.title,500)||!num(l.at,0,1e14)||![l.before,l.after].every(x=>str(x)||num(x)))))fail('Registro Coach non valido');

 if(data.legacyStarter!==undefined&&!creatureKeys.includes(data.legacyStarter))fail('Compagno storico non valido');
 if(data.creatures!==undefined){for(const key of [...new Set(['fire','water','wind',data.starter,...Object.keys(data.creatures)])]){const c=data.creatures[key];if(!creatureKeys.includes(key)||!c||![0,1,2].includes(c.unlocked)||!Number.isInteger(c.selected)||c.selected<0||c.selected>c.unlocked||!str(c.nickname,60))fail('Santuario non valido');}}
 if(data.preferences!==undefined){const p=data.preferences,keys=['today','companion','week','goals','coach'];if(!['full','minimal','off'].includes(p.rpg)||!['silent','balanced','detailed'].includes(p.coach)||!Array.isArray(p.widgets)||p.widgets.length!==5||new Set(p.widgets).size!==5||p.widgets.some(k=>!keys.includes(k))||!Array.isArray(p.hidden)||p.hidden.some(k=>!keys.includes(k)))fail('Preferenze non valide');}
 if(data.activePlanId!==undefined&&!id(data.activePlanId))fail('Scheda attiva non valida');
 if(data.measurements!==undefined){if(!Array.isArray(data.measurements)||data.measurements.length>10000)fail('Misure non valide');for(const m of data.measurements){if(!id(m.id)||!/^\d{4}-\d{2}-\d{2}$/.test(m.date)||!Number.isFinite(new Date(m.date+'T12:00:00').getTime()))fail('Data misura non valida');for(const k of ['weight','waist','hips','chest','arm','thigh'])if(m[k]!==undefined&&!num(m[k],1,500))fail('Misura non valida');}}
 if(data.goals!==undefined){if(!Array.isArray(data.goals)||data.goals.length>1000)fail('Obiettivi non validi');for(const g of data.goals)if(!id(g.id)||!str(g.title,120)||!['strength','consistency','weight','waist'].includes(g.kind)||!num(g.target,.1,10000)||!['up','down'].includes(g.direction)||typeof g.archived!=='boolean'||!str(g.contextKey,1000))fail('Obiettivo non valido');}
 for(const p of [...data.plans,...(data.draft?[data.draft]:[])])if(p.days!==undefined&&(!Array.isArray(p.days)||p.days.some(d=>!Number.isInteger(d)||d<0||d>6)))fail('Giorni non validi');
 return data;
}
