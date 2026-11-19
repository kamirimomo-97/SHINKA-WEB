import {avatarIdentity} from './avatar-identities.js?v=0.60.4';
import {rankBanner,galleryPortrait,escapeBanner} from './rank-banner.js?v=0.60.4';
import {galleryElements,galleryIds} from './avatar-gallery.js?v=0.60.4';
import {recommendedAvatarPopout,handPoseElements,previewEyeAnchor} from './rank-avatar-policy.js?v=0.60.4';
const overrides=new Map();
const popoutFor=e=>overrides.has(e)?overrides.get(e):recommendedAvatarPopout(e);
function selectElement(){const e=document.querySelector('#review-element').value;document.querySelector('#review-popout').checked=popoutFor(e);render();}
const $=s=>document.querySelector(s),elements=Object.keys(galleryElements).filter(e=>e!=='neutral');
$('#review-element').innerHTML=elements.map(e=>'<option value="'+e+'">'+galleryElements[e][0]+'</option>').join('');
$('#review-avatar').innerHTML=galleryIds.map(id=>'<option value="'+id+'">'+avatarIdentity(id).name+'</option>').join('');
function softPose(e){return handPoseElements.includes(e)&&$('#review-soft').checked;}
function plaque(id,e){const source='assets/avatar-gallery/'+id+'-'+e+'.webp',soft=softPose(e),[x,y]=previewEyeAnchor(id,e);const portrait=soft?'<svg class="soft-pose-art" viewBox="'+(x-150)+' '+(y-150)+' 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="'+escapeBanner(source)+'" width="768" height="1152"/></svg>':galleryPortrait(source);const html=rankBanner({rank:Number($('#review-rank').value),gems:0,name:'Allenatore SHINKA',title:'Allenatore',level:1000,portrait,avatarFraming:{popout:soft?false:popoutFor(e)}});return soft?html.replace('class="rank-banner','class="rank-banner rank-soft-avatar'):html;}

function grid(){if(!$('#review-all').open){$('#review-grid').innerHTML='';return;}$('#review-grid').innerHTML=elements.map(e=>'<section class="review-group" id="review-'+e+'"><h2>'+galleryElements[e][0]+'</h2><div class="review-cards">'+galleryIds.map(id=>'<article class="review-card" data-avatar="'+id+'" data-element="'+e+'"><h3>'+avatarIdentity(id).name+' · '+galleryElements[e][0]+'</h3>'+plaque(id,e)+'</article>').join('')+'</div></section>').join('');}
function render(){const id=$('#review-avatar').value,e=$('#review-element').value;$('#review-label').textContent=avatarIdentity(id).name+' · '+galleryElements[e][0];$('#review-hero').innerHTML=plaque(id,e);$('#review-summary').textContent='Combinazione '+(elements.indexOf(e)*10+galleryIds.indexOf(id)+1)+'/90 · '+(softPose(e)?'occhi centrati · sfumatura':($('#review-popout').checked?'prova fuori cornice':'ritaglio standard'))+' · profilo reale invariato';$('#review-note').textContent=handPoseElements.includes(e)?(softPose(e)?'Volto centrato sugli occhi; bordi del ritratto sfumati, cornice nitida.':'Sfumatura disattivata: confronto con il ritaglio precedente.'):'';grid();}
for(const id of ['review-rank','review-avatar','review-soft'])$('#'+id).addEventListener('change',render);
$('#review-element').addEventListener('change',selectElement);
$('#review-popout').addEventListener('change',()=>{overrides.set($('#review-element').value,$('#review-popout').checked);render();});
$('#review-next-avatar').onclick=()=>{const selector=$('#review-avatar');selector.value=galleryIds[(galleryIds.indexOf(selector.value)+1)%galleryIds.length];render();};
$('#review-next-element').onclick=()=>{const selector=$('#review-element');selector.value=elements[(elements.indexOf(selector.value)+1)%elements.length];selectElement();};
$('#review-all').addEventListener('toggle',grid);selectElement();