import {isProgressionTraining} from './training-validity.js?v=0.60.9';
import {weekKey,weekRewards,playerLevel} from './progression.js?v=0.60.9';
import {metrics} from './core.js?v=0.60.9';

export function weeklyStatus(db,now=Date.now()){
 if(!db.journeyV2)return null;
 const current=weekKey(now),available=weekRewards(db,now),claimed=Boolean(db.journeyV2.claims[current]);
 const active=db.sessions.some(s=>s.finished<=now&&weekKey(s.finished)===current&&isProgressionTraining(s));
 const unlock=new Date(current+'T00:00:00');unlock.setDate(unlock.getDate()+7);
 return {available,pending:active&&!claimed,claimed,unlock:unlock.getTime()};
}
export function sessionLevelChange(db,session){return Math.max(0,playerLevel(db)-playerLevel({...db,sessions:db.sessions.filter(s=>s.id!==session.id)}));}
const day=time=>new Date(time).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'short'});
export function rewardNotice(db,now=Date.now()){
 const state=weeklyStatus(db,now);if(!state||(!state.available.length&&!state.pending))return '';
 const title=state.available.length?`${state.available.length*500} XP da assegnare`:'500 XP in maturazione';
 const detail=state.available.length?(state.pending?'Altri 500 XP in maturazione':'Scegli il compagno'): 'Dal '+day(state.unlock);
 return `<button class="reward-notice" data-act="open-rewards"><span><strong>${title}</strong><small>${detail}</small></span><span aria-hidden="true">›</span></button>`;
}
export function rewardReceipt(db,session,now=Date.now()){
 const state=weeklyStatus(db,now);if(!state)return '';
 const gain=sessionLevelChange(db,session),level=playerLevel(db);
 const heading=gain?`Livello giocatore +${gain} · Livello ${level}`:`Livello giocatore ${level} · invariato`;
 let title,detail;
 if(state.pending){title='500 XP settimanali in maturazione';detail='Riscattabili da '+day(state.unlock)+'.';}
 else if(state.claimed){title='Ricompensa della settimana già gestita';detail='Nessun altro premio per questa settimana.';}
 else{title='Nessun XP maturato';detail='Completa una sessione di almeno 20 minuti con 2 serie allenanti per attivare la settimana.';}
 return `<div class="reward-receipt"><strong>${heading}</strong><p>${title}</p><small>${detail}</small>${!gain?'<small>La giornata non aggiunge un altro livello.</small>':''}${state.available.length?`<button data-act="open-rewards">Assegna ${state.available.length*500} XP disponibili →</button>`:''}</div>`;
}
