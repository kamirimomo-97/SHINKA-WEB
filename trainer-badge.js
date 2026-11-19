import {activeRank} from './rank-progress.js';
import {rankBanner,galleryPortrait} from './rank-banner.js';
import {galleryAsset,playableGallery} from './avatar-gallery.js';
import {playerLevel} from './progression.js';
export const trainerRanks=[{level:0,name:'Esordiente'},{level:10,name:'Allenatore'},{level:30,name:'Veterano'},{level:60,name:'Maestro'},{level:120,name:'Custode'},{level:240,name:'Leggenda'}];
export const badgeStyles=[{id:'origin',name:'Origine',level:0},{id:'silver',name:'Argento',level:10},{id:'aurora',name:'Aurora',level:30},{id:'obsidian',name:'Ossidiana',level:60}];
export function trainerRank(level){return [...trainerRanks].reverse().find(r=>level>=r.level)||trainerRanks[0];}
export function badgeStyle(db){return badgeStyles.find(s=>s.id===db.trainerBadge?.style&&playerLevel(db)>=s.level)?.id||'origin';}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function trainerBadge(db,level,portrait){const state=activeRank(db,level);return rankBanner({...state,background:'assets/avatar-gallery/gym-neutral.webp',avatarFraming:db.avatar?.gallery||!db.avatar?{popout:playableGallery(db.avatar?.gallery).element==='neutral'}:false,name:db.athlete?.name||'Allenatore',title:trainerRank(level).name,portrait:db.avatar?.gallery||!db.avatar?galleryPortrait(galleryAsset(playableGallery(db.avatar?.gallery))):portrait,interactive:true});}
export function setupTrainerBadges({getDb,modal,preview,audioControls=()=>''}){
 document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;
 if(b.dataset.act==='trainer-open'){const db=getDb(),level=playerLevel(db),state=activeRank(db,level);modal('<section class="trainer-badge-editor"><h2>La tua targhetta</h2><div class="badge-preview" inert>'+preview()+'</div><p>'+['Acciaio','Argento','Smeraldo','Zaffiro','Rubino','Oro','Diamante perlaceo'][state.rank]+' · '+state.gems+'/5 gemme · Livello '+level+'</p><p>Il titolo dell’allenatore e il livello storico restano distinti dal rank. Il livello storico non diminuisce. Per inattività: Rubino perde una gemma ogni 21 giorni, Oro ogni 14, Diamante ogni 7. Esaurite le gemme, si torna al rank precedente con 5 gemme; Zaffiro è il limite minimo. Un allenamento valido azzera il conteggio.</p>'+audioControls()+'<a href="rank-lab.html">Prova tutti i rank nel laboratorio</a><div class="row badge-editor-actions"><button data-act="trainer-cancel">Chiudi</button><button data-act="wardrobe-open">Personalizza avatar</button></div></section>');}
 if(b.dataset.act==='trainer-cancel')document.querySelector('#modal').close();
 });
}

