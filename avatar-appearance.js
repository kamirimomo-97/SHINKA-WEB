import {avatarColorPalettes,normalizeAvatar,normalizeAppearance as appearanceDefaults,avatarAsset,avatarModuleFiles} from './avatar-catalog.js?v=0.60.4';
import {avatarGeometry} from './avatar-geometry.js?v=0.60.4';
import {avatarFit} from './avatar-fit.js?v=0.60.4';

export const appearancePalettes=avatarColorPalettes;
export function normalizeAppearance(avatar={}){return appearanceDefaults(avatar);}
function rgb(hex){return [1,3,5].map(offset=>parseInt(hex.slice(offset,offset+2),16));}

// R = exposed skin, G = irises, B = the hair already drawn on a complete head.
// Clothes and unmarked pixels are never recolored.
export function recolorAvatarPixels(image,avatar,materials){
  const choice=normalizeAppearance(avatar),pixels=image.data,mask=materials.data;
  const colors=Object.fromEntries(['skin','eyes','hair'].map(field=>[field,rgb(appearancePalettes[field][choice[field]].color)]));
  const histogram=new Uint32Array(256);let count=0;
  for(let i=0;i<pixels.length;i+=4)if(mask[i+2]>128&&mask[i+3]>8){
    const value=Math.round(.2126*pixels[i]+.7152*pixels[i+1]+.0722*pixels[i+2]);
    if(value>50){histogram[value]++;count++;}
  }
  let hairAnchor=140,total=0;
  for(let value=51;value<256;value++){total+=histogram[value];if(total>=count/2&&count){hairAnchor=value;break;}}
  for(let i=0;i<pixels.length;i+=4){
    if(pixels[i+3]<8||mask[i+3]<8)continue;
    const field=mask[i+2]>128?'hair':mask[i+1]>128?'eyes':mask[i]>128?'skin':null;
    if(!field||field==='skin'&&choice.skin==='light'||field==='eyes'&&choice.eyes==='brown')continue;
    const luminance=.2126*pixels[i]+.7152*pixels[i+1]+.0722*pixels[i+2];
    for(let channel=0;channel<3;channel++){
      const target=colors[field][channel];
      if(field==='hair'){
        pixels[i+channel]=luminance<=hairAnchor?target*Math.max(0,(luminance-25)/(hairAnchor-25)):target+(255-target)*(luminance-hairAnchor)/(255-hairAnchor);
      }else{
        const base=field==='skin'?199:78,light=(luminance-base)/Math.max(base,255-base);
        pixels[i+channel]=light>=0?target+(255-target)*light:target*(1+light);
      }
    }
  }
  return image;
}

const loadedAssets=new Map(),renderedAvatars=new Map();
function loadAsset(source){
  if(!loadedAssets.has(source)){
    if(loadedAssets.size>=40)loadedAssets.delete(loadedAssets.keys().next().value);
    const ready=new Promise((resolve,reject)=>{
      const image=new Image();image.decoding='async';
      image.onload=()=>resolve(image);
      image.onerror=()=>{loadedAssets.delete(source);reject(new Error('Blocco personaggio non disponibile'));};
      image.src=source;
    });loadedAssets.set(source,ready);
  }
  return loadedAssets.get(source);
}
function canvasFor(image){
  const canvas=document.createElement('canvas');canvas.width=image?.width||avatarGeometry.width;canvas.height=image?.height||avatarGeometry.height;
  if(image)canvas.getContext('2d').drawImage(image,0,0);return canvas;
}
function tintedPiece(image,mask,avatar){
  const canvas=canvasFor(image),context=canvas.getContext('2d'),materials=canvasFor(mask);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height);
  const roles=materials.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
  context.putImageData(recolorAvatarPixels(pixels,avatar,roles),0,0);return canvas;
}
export function avatarPiecePlacement(avatar,file,width,height){
  let [x,y]=avatarGeometry[avatar.model].frames[file];
  const fit=avatarFit[avatar.model];
  if(file.startsWith('head-')){
    x+=fit.torsos[avatar.modules.torso]-fit.heads[avatar.hairStyle];
  }else if(file.startsWith('legs-')||file.startsWith('feet-')){
    y=510+(y-510)*fit.legRatio;
    if(file.startsWith('legs-'))height*=fit.legRatio;
    if(avatar.modules.torso==='base'&&fit.baseWaist){
      x+=fit.baseWaist.x-fit.baseWaist.hips[avatar.modules.legs];
      y+=fit.baseWaist.y;
    }
  }
  return [x,y,width,height];
}
async function composeAvatar(avatar){
  const files=avatarModuleFiles(avatar);
  const pieces=await Promise.all(files.map(async file=>{
    const [image,mask]=await Promise.all([loadAsset(avatarAsset(avatar.model,file)),loadAsset(avatarAsset(avatar.model,file+'-mask'))]);
    return {file,image,mask};
  }));
  const result=canvasFor(),context=result.getContext('2d');
  for(const {file,image,mask}of pieces){
    context.drawImage(tintedPiece(image,mask,avatar),...avatarPiecePlacement(avatar,file,image.width,image.height));
  }
  return result;
}
export function hydrateAvatars(root=document){
  for(const image of root.querySelectorAll('img[data-avatar-choice]')){
    const avatar=normalizeAvatar(JSON.parse(image.dataset.avatarChoice)),key=JSON.stringify(avatar);
    if(!renderedAvatars.has(key)){
      if(renderedAvatars.size>=8)renderedAvatars.delete(renderedAvatars.keys().next().value);
      renderedAvatars.set(key,composeAvatar(avatar));
    }
    renderedAvatars.get(key).then(canvas=>{
      let rendered=canvas;
      if(image.dataset.avatarView==='head'){
        const [x,y,width,height]=avatarGeometry[avatar.model].head;
        rendered=document.createElement('canvas');rendered.width=width;rendered.height=height;
        rendered.getContext('2d').drawImage(canvas,x,y,width,height,0,0,width,height);
      }
      image.src=rendered.toDataURL('image/png');
      const editor=image.closest('.wardrobe');
      if(editor){editor.querySelector('[data-act="wardrobe-save"]').disabled=false;editor.querySelector('#wardrobe-status').textContent='';}
    }).catch(()=>{
      renderedAvatars.delete(key);const editor=image.closest('.wardrobe');
      if(editor)editor.querySelector('#wardrobe-status').textContent='Impossibile caricare l’anteprima. Riprova con una connessione disponibile.';
    });
  }
}
