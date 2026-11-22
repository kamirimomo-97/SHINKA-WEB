export const TRAINING_RULE_VERSION=2;
export const MIN_TRAINING_MS=20*60*1000;
export const MIN_WORKING_SETS=2;
export function completedWorkingSets(session){return (session.exercises||[]).flatMap(ex=>ex.sets||[]).filter(s=>s.done===true&&s.type!=='warmup'&&Number.isFinite(s.reps)&&s.reps>0&&Number.isFinite(s.kg)&&s.kg>=0);}
export function isValidTraining(session,now=Date.now()){return Number.isFinite(session.started)&&session.started>=0&&Number.isFinite(session.finished)&&session.finished<=now&&session.finished-session.started>=MIN_TRAINING_MS&&completedWorkingSets(session).length>=MIN_WORKING_SETS;}
// Existing workouts keep their earned progression. New completions explicitly carry the new rule.
export function isProgressionTraining(session,now=Date.now()){return session.trainingRuleVersion===TRAINING_RULE_VERSION?isValidTraining(session,now):(session.exercises||[]).some(ex=>(ex.sets||[]).some(s=>s.done&&s.type!=='warmup'));}
