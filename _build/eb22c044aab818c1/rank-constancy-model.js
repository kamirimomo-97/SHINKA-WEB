import {activeRank,calculateRankProgress} from './rank-progress.js?v=0.60.9';
import {playerLevel} from './progression.js?v=0.60.9';
import {rankForLevel} from './rank-banner.js?v=0.60.9';
import {RANKS,ENTRY,DECAY,PRIME_RULES,localDate,monday,addDate,distance} from './rank-system.js?v=0.60.9';
import {MIN_TRAINING_MS,MIN_WORKING_SETS} from './training-validity.js?v=0.60.9';
export const RANK_NAMES=Object.freeze([...RANKS,'SHINKA PRIME']);
// Presentation adapter only. The shared engine computes progression; nothing is saved here.
export function rankConstancyModel(db,now=Date.now()){
 const progress=calculateRankProgress(db,now),level=playerLevel(db),active=activeRank({...db,rankProgress:progress},level),calendar=progress.primeCalendar;
 const current=active.prime?7:active.rank,today=localDate(now,progress.timeZone),start=monday(today),end=addDate(start,6);
 const dates=progress.processedDates.filter(d=>d>=start&&d<=end&&d<=today&&(active.prime||calendar.eligibleSince===null||d>calendar.eligibleSince));
 const history=calendar.history.map(h=>({...h})),highest=Math.max(active.rank,rankForLevel(level).rank),cost=active.rank+1;
 return {current,rank:active.rank,gems:active.gems,partial:active.partial||0,level,cost,remaining:active.gems===5?0:Math.max(0,cost-(active.partial||0)),prime:!!active.prime,weeks:active.weeks||0,streak:calendar.streak,requiredWeeks:history.length?PRIME_RULES.reclaimWeeks:PRIME_RULES.firstWeeks,weekDays:dates.length,timeZone:progress.timeZone,weekStart:start,weekEnd:end,eligibleSince:calendar.eligibleSince,history,nextLoss:!active.prime&&DECAY[active.rank]?addDate(progress.decayAt,DECAY[active.rank]):null,daysToLoss:!active.prime&&DECAY[active.rank]?Math.max(0,distance(today,addDate(progress.decayAt,DECAY[active.rank]))):null,highest,states:RANK_NAMES.map((_,i)=>i===current?'current':i===7?(history.length?'reclaim':'future'):i<=highest?'earned':'future'),returnTo:db.active?'#workout':'#home'};
}
export function rankConditions(rank){
 if(rank===7)return {
  unlock:[`Diamante perlaceo con 5 gemme, poi ${PRIME_RULES.firstWeeks} settimane consecutive valide. Il conteggio comincia dopo il completamento di Diamante.`,`Una settimana valida richiede almeno ${PRIME_RULES.daysPerWeek} giorni distinti di allenamento valido. Dopo una perdita bastano ${PRIME_RULES.reclaimWeeks} settimane consecutive valide.`,`Le 7 gemme rappresentano i rank ordinari conquistati: non si accumulano e non si perdono individualmente.`],
  maintain:[`Almeno ${PRIME_RULES.daysPerWeek} giorni distinti validi ogni settimana, da lunedì 00:00 a domenica 23:59:59.`,`Controllo il lunedì alle 00:00 locali sulla settimana appena conclusa, nel fuso orario dell’utente. Massimo un giorno valido per data locale.`,`Il contatore indica le settimane consecutive mantenute dopo l’incoronazione.`],
  loss:[`Con meno di ${PRIME_RULES.daysPerWeek} giorni validi nella settimana conclusa si torna a Diamante perlaceo con 5 gemme, senza altre penalità contemporanee sulle gemme.`,`Tutte le incoronazioni e i periodi di possesso rimangono nello storico. Livello, XP, titoli e creature non vengono cancellati.`]};
 const cost=rank+1,fifth=ENTRY[rank]+5*cost;
 return {
  unlock:[rank?`Prima soglia d’ingresso: livello ${ENTRY[rank]}, dopo il completamento del rank precedente.`:'Il percorso parte da Acciaio al livello 0.',`${cost} ${cost===1?'allenamento valido':'allenamenti validi'} per gemma; 5 gemme per completare il rank. Prima quinta gemma al livello ${fifth}.`,rank===6?'Diamante 5/5 apre il percorso di costanza verso SHINKA PRIME.':'Dopo 5 gemme, il successivo allenamento valido attiva la promozione.','Il livello storico resta distinto dal rank attivo: una riconquista non lo reimposta.'],
  maintain:[DECAY[rank]?`Una gemma persa ogni ${DECAY[rank]} giorni di inattività.`:'Nessuna perdita di gemme per inattività in questo rank.','Un allenamento valido azzera il conteggio di inattività.',`Nelle nuove sessioni: almeno ${MIN_TRAINING_MS/60000} minuti e ${MIN_WORKING_SETS} serie allenanti completate complessivamente, anche dello stesso esercizio.`],
  loss:DECAY[rank]?[`Esaurite le gemme, si retrocede a ${RANKS[rank-1]} con 5 gemme.`,'Zaffiro è il limite minimo delle retrocessioni per inattività.','La retrocessione non abbassa il livello storico e non cancella XP, allenamenti, titoli o creature.']:['Nessuna retrocessione per inattività.','Zaffiro è il limite minimo delle retrocessioni provenienti dai rank superiori.']};
}
