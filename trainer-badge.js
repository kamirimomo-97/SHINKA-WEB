import {equippedTitle} from './title-state.js?v=0.60.8';
import {ALL_CONTENT_UNLOCKED} from './app-environment.js?v=0.60.8';
import {ALLOW_LABS} from './app-environment.js?v=0.60.8';
import {activeRank} from './rank-progress.js?v=0.60.8';
import {rankBanner,galleryPortrait} from './rank-banner.js?v=0.60.8';
import {galleryAsset,playableGallery} from './avatar-gallery.js?v=0.60.8';
import {playerLevel} from './progression.js?v=0.60.8';
export const trainerRanks=[{level:0,name:'Esordiente'},{level:10,name:'Allenatore'},{level:30,name:'Veterano'},{level:60,name:'Maestro'},{level:120,name:'Custode'},{level:240,name:'Leggenda'}];
export const badgeStyles=[{id:'origin',name:'Origine',level:0},{id:'silver',name:'Argento',level:10},{id:'aurora',name:'Aurora',level:30},{id:'obsidian',name:'Ossidiana',level:60}];
export function trainerRank(level){return [...trainerRanks].reverse().find(r=>level>=r.level)||trainerRanks[0];}
export function badgeStyle(db){return badgeStyles.find(s=>s.id===db.trainerBadge?.style&&playerLevel(db)>=s.level)?.id||'origin';}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function trainerBadge(db,level,portrait){const state=activeRank(db,level),title=equippedTitle(db,{sandbox:ALL_CONTENT_UNLOCKED&&db.demoMax?.titlesUnlocked!==false});return rankBanner({...state,background:'assets/avatar-gallery/gym-neutral.webp',avatarFraming:db.avatar?.gallery||!db.avatar?{popout:playableGallery(db.avatar?.gallery).element==='neutral'}:false,name:db.athlete?.name||'Allenatore',title:title.name,titleRarity:title.rarity,portrait:db.avatar?.gallery||!db.avatar?galleryPortrait(galleryAsset(playableGallery(db.avatar?.gallery))):portrait,interactive:true});}
export function setupTrainerBadges({getDb,modal,preview,audioControls=()=>''}){
 document.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target.matches('.prime-v2 [role=button]')){ev.preventDefault();ev.target.click();}});
 document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;
 if(b.dataset.act==='trainer-open'){const db=getDb(),level=playerLevel(db),state=activeRank(db,level);modal('<section class="trainer-badge-editor"><h2>La tua targhetta</h2><div class="badge-preview" inert>'+preview()+'</div><p>'+(state.prime?'SHINKA PRIME · '+state.weeks+' settimane consecutive':['Acciaio','Argento','Smeraldo','Zaffiro','Rubino','Oro','Diamante perlaceo'][state.rank]+' · '+state.gems+'/5 gemme')+' · Livello '+level+'</p><p>Il titolo indossato è una scelta personale: le conquiste restano disponibili nella collezione anche cambiando rank. Il livello storico non diminuisce. Per inattività: Rubino perde una gemma ogni 21 giorni, Oro ogni 14, Diamante ogni 7. Esaurite le gemme, si torna al rank precedente con 5 gemme; Zaffiro è il limite minimo. Un allenamento valido azzera il conteggio.</p><p>PRIME: Diamante 5/5 e 8 settimane consecutive con almeno 3 giorni validi, conteggiate dal completamento di Diamante. Controllo ogni lunedì nel tuo fuso orario. Perdita: ritorno a Diamante 5/5; riconquista in 4 settimane valide. Il contatore indica le settimane mantenute dopo la conquista.</p><p>'+ (state.prime?'PRIME attivo · '+state.weeks+' settimane mantenute.':'Serie PRIME: '+(db.rankProgress?.primeCalendar?.streak||0)+' / '+(db.rankProgress?.primeCalendar?.history.length?4:8)+' settimane valide consecutive.')+'</p><h3>Storico PRIME</h3>'+((db.rankProgress?.primeCalendar?.history||[]).map(h=>'<p>'+esc(h.start)+' → '+esc(h.end||'In corso')+' · '+h.weeks+' settimane mantenute</p>').join('')||'<p>Nessuna incoronazione ancora.</p>')+audioControls()+(ALLOW_LABS?'<a href="rank-lab.html">Prova tutti i rank nel laboratorio</a>':'')+'<div class="row badge-editor-actions"><button data-act="titles-open">I tuoi titoli</button><button data-act="trainer-cancel">Chiudi</button><button data-act="wardrobe-open">Personalizza avatar</button></div></section>');}
 if(b.dataset.act==='trainer-cancel')document.querySelector('#modal').close();
 });
}

