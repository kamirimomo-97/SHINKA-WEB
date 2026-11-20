import {avatarArt} from './wardrobe.js?v=0.60.5';
import {hydrateAvatars} from './avatar-appearance.js?v=0.60.5';
import {readIdentity,PROFILE_KEY} from './badge-identity.js?v=0.60.5';
import {gemCount,steelAssets,steelAsset} from './raster-steel.js?v=0.60.5';
let count=0,ready=false;
const $=s=>document.querySelector(s);
$('#plaque').innerHTML=steelAssets.map((src,n)=>`<img class="raster-badge ${n===0?'active':''}" data-state="${n}" src="${src}" width="2172" height="724" alt="" aria-hidden="true" decoding="async">`).join('');
$('#plaque').insertAdjacentHTML('afterbegin','<span class="badge-background" aria-hidden="true"></span><span class="badge-live-portrait"></span>');
$('#plaque').insertAdjacentHTML('beforeend','<span class="badge-live-name"></span><span class="badge-live-title">Esordiente</span><span class="badge-avatar-front" aria-hidden="true"></span>');
let identity,previewIdentity=false;
function showIdentity(next){identity=next;document.querySelector('.badge-live-name').textContent=next.name;document.querySelector('.badge-live-name').title=next.name;document.querySelector('.badge-live-portrait').innerHTML=avatarArt(next.avatar,'head');document.querySelector('.badge-avatar-front').innerHTML=avatarArt(next.avatar,'head');hydrateAvatars(document.querySelector('.badge-live-portrait'));hydrateAvatars(document.querySelector('.badge-avatar-front'));$('#profile-source').textContent=previewIdentity?'Anteprima temporanea':next.hasProfile?'Nome e avatar dal tuo profilo':'Nessun profilo salvato · anteprima';$('#preview-name').value=next.name;$('#preview-avatar').value=next.avatar?.gallery?.id||'';}
function loadProfile(){previewIdentity=false;let profile;try{profile=readIdentity(window.localStorage);}catch{profile=readIdentity({getItem:()=>null});}showIdentity(profile);}
$('#preview-name').addEventListener('input',e=>{previewIdentity=true;identity={...identity,name:e.target.value.trim().slice(0,60)||'Allenatore'};document.querySelector('.badge-live-name').textContent=identity.name;document.querySelector('.badge-live-name').title=identity.name;$('#profile-source').textContent='Anteprima temporanea';});
$('#preview-avatar').addEventListener('change',e=>{if(!e.target.value){loadProfile();return;}previewIdentity=true;showIdentity({...identity,avatar:{gallery:{id:e.target.value,element:identity.avatar?.gallery?.element||'neutral'}}});});
$('#use-profile').addEventListener('click',loadProfile);
window.addEventListener('storage',e=>{if((e.key===PROFILE_KEY||e.key===null)&&!previewIdentity)loadProfile();});
window.addEventListener('focus',()=>{if(!previewIdentity)loadProfile();});
loadProfile();
$('#frame-only').addEventListener('change',e=>$('#plaque').classList.toggle('is-frame-only',e.target.checked));
$('#crest-preview').innerHTML='<svg class="raster-crest" viewBox="1640 120 520 440" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Stemma ingrandito"><image id="crest-image" width="2172" height="724" href="'+steelAsset(0)+'"/></svg>';
function render(){
 document.querySelectorAll('.raster-badge').forEach((img,n)=>img.classList.toggle('active',n===count));
 $('#plaque').setAttribute('aria-label',`Acciaio, ${count} gemme su 5`);$('#crest-image').setAttribute('href',steelAsset(count));
 $('#gem-count').textContent=count+' / 5 gemme';$('#level').textContent=count;
 $('#notice').textContent=!ready?'Caricamento targhette…':count===5?'Stemma completo':count===0?'Cinque gemme da accendere':`Gemma ${count} accesa`;
 $('#advance').disabled=!ready||count===5;$('#reset').disabled=!ready;
 document.querySelectorAll('[data-count]').forEach(b=>{b.disabled=!ready;b.setAttribute('aria-pressed',String(Number(b.dataset.count)===count));});
}
function advance(delta){if(!ready)return;count=gemCount(count+delta);render();}
$('#advance').addEventListener('click',()=>advance(1));$('#reset').addEventListener('click',()=>{count=0;render();});
$('#states').addEventListener('click',e=>{const b=e.target.closest('[data-count]');if(!ready||!b)return;count=gemCount(b.dataset.count);render();});
render();
Promise.all([...document.querySelectorAll('.raster-badge')].map(img=>img.decode())).then(()=>{ready=true;render();}).catch(()=>{$('#notice').textContent='Caricamento incompleto. Ricarica la pagina per riprovare.';});
