import {comparisonKey,timerSeconds} from './core.js?v=0.60.9';
import {normalizeExerciseText} from './title-exercises.js?v=0.60.9';
const rules=[
 [['Panca piana','Panca piana bilanciere','Bench press','Barbell bench press','Panca inclinata manubri'],['chest'],['triceps','deltoids'],'Pettorali','Tricipiti e deltoidi','front'],
 [['Lat machine','Lat pulldown','Trazioni','Trazioni assistite','Pull up','Chin up'],['upper-back'],['biceps'],'Dorsali','Bicipiti','back'],
 [['Rematore','Rematore bilanciere','Rematore manubrio','Rematore manubri','Pulley','Rematore al cavo'],['upper-back'],['biceps','deltoids'],'Dorso','Bicipiti e deltoidi','back'],
 [['Alzate laterali','Alzate laterali manubri'],['deltoids'],['trapezius'],'Deltoidi','Trapezio','front'],
 [['Reverse fly','Alzate posteriori'],['deltoids'],['upper-back','trapezius'],'Deltoidi posteriori','Dorso e trapezio','back'],
 [['Military press','Shoulder press','Overhead press','Shoulder press manubri','Lento avanti manubri'],['deltoids'],['triceps'],'Deltoidi','Tricipiti','front'],
 [['Curl manubri','Curl bicipiti','Curl bilanciere','Curl martello','Hammer curl'],['biceps'],['forearm'],'Bicipiti','Avambracci','front'],
 [['Pushdown','Push down','Tricipiti al cavo','French press','Estensioni tricipiti'],['triceps'],[],'Tricipiti','','back'],
 [['Squat','Squat bilanciere','Back squat','Front squat','Squat frontale','Goblet squat','Leg press','Pressa','Pressa 45','Affondi','Affondi manubri','Affondi camminati'],['quadriceps','gluteal'],['hamstring'],'Quadricipiti e glutei','Femorali','front'],
 [['Stacco','Stacco da terra','Deadlift','Stacco classico','Stacco sumo','Sumo deadlift','Stacco rumeno','Romanian deadlift'],['gluteal','hamstring'],['lower-back','upper-back'],'Glutei e femorali','Schiena','back'],
 [['Leg curl'],['hamstring'],[],'Femorali','','back'],
 [['Calf raise','Calf raises','Calf seduto','Polpacci'],['calves'],[],'Polpacci','','back'],
 [['Crunch','Crunch al cavo','Plank','Leg raise','Sollevamenti gambe'],['abs'],['obliques'],'Addominali','Obliqui','front']
];
const registry=new Map(rules.flatMap(([names,primary,secondary,label,support,view])=>names.map(name=>[normalizeExerciseText(name),{primary,secondary,label,support,view}])));
export function muscleProfile(ex){return registry.get(normalizeExerciseText(ex?.name))||{primary:[],secondary:[],label:'Non classificato',support:'',view:'front'};}
export function exerciseEquipment(ex){const name=normalizeExerciseText(ex?.name);return ex?.equipment||(['alzate laterali','alzate laterali manubri','curl manubri','panca inclinata manubri','rematore manubrio','rematore manubri','shoulder press manubri'].includes(name)?'Manubri':['panca piana','panca piana bilanciere','military press'].includes(name)?'Bilanciere':name==='lat machine'?'Macchina':'');}
export function exerciseVideo(ex){return ['alzate laterali','alzate laterali manubri'].includes(normalizeExerciseText(ex?.name))?'assets/exercises/alzate-laterali.mp4':null;}
export function lastCompatible(sessions,exercise){for(const session of [...sessions].sort((a,b)=>b.finished-a.finished)){const ex=session.exercises.find(e=>comparisonKey(e)===comparisonKey(exercise)&&e.sets.some(s=>s.done));if(ex)return {session,exercise:ex};}return null;}
export function previousSet(previous,exercise,index){const type=exercise.sets[index]?.type;if(!previous||!type)return null;const ordinal=exercise.sets.slice(0,index).filter(s=>s.type===type).length;return previous.exercise.sets.filter(s=>s.done&&s.type===type)[ordinal]||null;}
export function resolveCursor(active,cursor){
 let i=cursor?.id===active.id?Math.min(cursor.i,Math.max(0,active.exercises.length-1)):-1;
 if(!Number.isInteger(i)||i<0)i=Math.max(0,active.exercises.findIndex(e=>e.sets.some(s=>!s.done)));
 const ex=active.exercises[i];if(!ex)return {id:active.id,i:0,j:0};
 let j=cursor?.id===active.id&&cursor.i===i?cursor.j:-1;
 if(!Number.isInteger(j)||j<0||j>=ex.sets.length)j=Math.max(0,ex.sets.findIndex(s=>!s.done));
 return {id:active.id,i,j};
}
export function validSetValues(s){return s&&Number.isFinite(s.kg)&&s.kg>=0&&s.kg<=10000&&Number.isInteger(s.reps)&&s.reps>0&&s.reps<=1000&&(s.rir===undefined||s.rir===''||Number.isFinite(s.rir)&&s.rir>=0&&s.rir<=10)&&(s.rpe===undefined||s.rpe===''||Number.isFinite(s.rpe)&&s.rpe>=1&&s.rpe<=10)&&(s.type!=='drop'||(s.segments||[]).every(z=>validSetValues({...z,type:'normale'})));}
// Only the active session and timer are replaced. Failed storage preserves both originals.
export function updateActive(db,persist,mutate){if(!db.active)return false;const original=db.active,timer=db.timer,next={active:structuredClone(original),timer:structuredClone(timer??null)};mutate(next);db.active=next.active;db.timer=next.timer;try{if(persist()!==false)return true;}catch{}db.active=original;db.timer=timer;return false;}
export function completeActiveSet(draft,i,j,values,now=Date.now()){
 const ex=draft.active.exercises[i],set=ex?.sets[j];if(!set||set.done)throw Error('Serie già completata o non disponibile');
 const next={...set,...values};if(!validSetValues(next))throw Error('Controlla carico, ripetizioni e segmenti drop');Object.assign(set,next,{done:true});draft.timer=now+(set.rest??ex.rest??draft.active.rest??90)*1000;
}
export function restoreActiveSet(draft,i,j){const set=draft.active.exercises[i]?.sets[j];if(!set)throw Error('Serie non disponibile');set.done=false;}
export function activeCounts(active){return {done:active.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0),total:active.exercises.reduce((n,e)=>n+e.sets.length,0)};}
export {timerSeconds};



