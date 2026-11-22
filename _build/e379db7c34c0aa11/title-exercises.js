// Approved legacy aliases are used only to build an ID-based registry. No fuzzy matching.
export const FAMILY_LABELS={bench:'Panca piana bilanciere',squat:'Squat',deadlift:'Stacco',legpress:'Leg press',lunge:'Affondi',row:'Rematore',pullup:'Trazioni',curl:'Curl bicipiti',shoulderpress:'Shoulder press',lateral:'Alzate laterali',triceps:'Tricipiti',calves:'Polpacci',core:'Core',other:'Altro / non classificato'};
export const normalizeExerciseText=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const definitions=[
 ['bench','flat-barbell',['Panca piana','Panca piana bilanciere','Barbell bench press','Bench press']],
 ['squat','back-squat',['Squat','Back squat','Squat bilanciere']],['squat','front-squat',['Front squat','Squat frontale']],['squat','goblet-squat',['Goblet squat']],
 ['deadlift','conventional',['Stacco','Stacco da terra','Deadlift','Stacco classico']],['deadlift','romanian',['Stacco rumeno','Romanian deadlift']],['deadlift','sumo',['Stacco sumo','Sumo deadlift']],
 ['legpress','leg-press',['Leg press','Pressa','Pressa 45']],['lunge','lunge',['Affondi','Affondi manubri','Affondi camminati']],
 ['row','barbell-row',['Rematore','Rematore bilanciere','Barbell row']],['row','dumbbell-row',['Rematore manubrio','Rematore manubri']],['row','cable-row',['Pulley','Rematore al cavo']],
 ['pullup','pullup',['Trazioni','Trazioni assistite','Pull up','Pullup','Chin up']],['curl','dumbbell-curl',['Curl manubri','Curl bicipiti']],['curl','barbell-curl',['Curl bilanciere']],['curl','hammer-curl',['Hammer curl','Curl martello']],
 ['shoulderpress','barbell-press',['Military press','Shoulder press','Overhead press']],['shoulderpress','dumbbell-press',['Shoulder press manubri','Lento avanti manubri']],
 ['lateral','lateral-raise',['Alzate laterali','Alzate laterali manubri']],['triceps','pushdown',['Pushdown','Push down','Tricipiti al cavo']],['triceps','french-press',['French press','Estensioni tricipiti']],
 ['calves','calf-raise',['Calf raise','Calf raises','Polpacci','Calf seduto']],['core','crunch',['Crunch','Crunch al cavo']],['core','plank',['Plank']],['core','leg-raise',['Leg raise','Sollevamenti gambe']]
];
const aliases=new Map(definitions.flatMap(([family,variant,names])=>names.map(name=>[normalizeExerciseText(name),{family,variant}])));
export function familyDefinition(ex){const alias=aliases.get(normalizeExerciseText(ex.name));let match=ex.achievementFamily&&Object.hasOwn(FAMILY_LABELS,ex.achievementFamily)?{family:ex.achievementFamily,variant:alias?.family===ex.achievementFamily?alias.variant:normalizeExerciseText(ex.name)}:alias;if(match?.family==='bench'&&(['per-hand','assisted','bodyweight'].includes(ex.loadMode)||['manubri','dumbbell','dumbbells','macchina','smith machine'].includes(normalizeExerciseText(ex.equipment))))return null;if(match?.family==='bench')match={...match,variant:'flat-barbell'};return match||null;}
export function buildExerciseRegistry(db){const registry=new Map();for(const ex of [...(db.library||[]),...(db.sessions||[]).flatMap(s=>s.exercises||[]),...(db.plans||[]).flatMap(s=>s.exercises||[])]){const definition=familyDefinition(ex);if(definition&&!registry.has(ex.id))registry.set(ex.id,definition);}return registry;}
export function exerciseIdentity(ex,registry){const d=ex.achievementFamily?familyDefinition(ex):registry.get(ex.id);return JSON.stringify([d?.family||'custom',d?.variant||normalizeExerciseText(ex.name),normalizeExerciseText(ex.equipment),ex.loadMode||'total',ex.handCount||1]);}
const groups={chest:['petto','pettorali','chest'],legs:['gambe','quadricipiti','femorali','catena posteriore','glutei','polpacci','hamstrings','quads'],pull:['dorso','schiena','back','bicipiti','biceps'],push:['spalle','deltoidi','shoulders','tricipiti','triceps']};
export function muscleGroup(ex){const muscle=normalizeExerciseText(ex.muscle);return Object.entries(groups).find(([,names])=>names.includes(muscle))?.[0]||'other';}
export function isDumbbell(ex){const gear=normalizeExerciseText(ex.equipment);return ['manubri','dumbbell','dumbbells'].includes(gear)||!gear&&ex.loadMode==='per-hand';}
