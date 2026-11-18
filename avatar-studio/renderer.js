import {RIG,PALETTES,selectedItems} from './catalog.js';
const cache=new Map();
function load(src){if(!cache.has(src))cache.set(src,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{if(img.naturalWidth!==RIG.width||img.naturalHeight!==RIG.height){cache.delete(src);reject(Error('Immagine incompatibile con il modello'));}else resolve(img)};img.onerror=()=>{cache.delete(src);reject(Error('Immagine non disponibile. Riprova con la connessione attiva.'))};img.src=src;}));return cache.get(src);}
function canvas(){const c=document.createElement('canvas');c.width=RIG.width;c.height=RIG.height;return c;}
function channels(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
function recolor(source,mode,hex,eyes){const c=canvas(),ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);const data=ctx.getImageData(0,0,c.width,c.height),p=data.data,target=channels(hex),eyeColor=eyes&&channels(eyes);
 for(let i=0;i<p.length;i+=4){if(p[i+3]<16)continue;const r=p[i],g=p[i+1],b=p[i+2],lum=.2126*r+.7152*g+.0722*b;const x=(i/4)%c.width,y=Math.floor(i/4/c.width);
  const iris=mode==='skin'&&(((x-471)/12)**2+((y-211)/18)**2<1||((x-548)/12)**2+((y-210)/18)**2<1)&&r>b+12&&lum<155;
  const skin=mode==='skin'&&r>g+10&&g>b+7&&r-g<2.5*(g-b)+18;
  const gray=mode!=='skin'&&Math.max(r,g,b)-Math.min(r,g,b)<28&&lum>22;
  if(iris&&eyeColor){for(let k=0;k<3;k++)p[i+k]=Math.min(255,eyeColor[k]*lum/80);}
  else if(skin||gray){const anchor=mode==='skin'?160:mode==='hair'?205:66;for(let k=0;k<3;k++)p[i+k]=lum<=anchor?target[k]*lum/anchor:target[k]+(255-target[k])*(lum-anchor)/(255-anchor);}
 }ctx.putImageData(data,0,0);return c;
}
export async function renderAvatar(target,state){const items=selectedItems(state),assets=await Promise.all([load(RIG.body),...items.map(i=>load(i.asset))]);const body=state.appearance.skin==='original'&&state.appearance.eyes==='brown'?assets[0]:recolor(assets[0],'skin',PALETTES.skin[state.appearance.skin].hex,PALETTES.eyes[state.appearance.eyes].hex);
 const out=canvas(),ctx=out.getContext('2d');ctx.drawImage(body,0,0);
 // Occlusion changes visibility only: the anatomy and attachment positions stay fixed.
 if(items.some(i=>i.occludes?.includes('feet')))ctx.clearRect(0,1302,RIG.width,RIG.height-1302);
 if(items.some(i=>i.occludes?.includes('shoulderCaps'))){ctx.clearRect(320,330,132,100);ctx.clearRect(565,330,180,100);}
 for(let index=0;index<items.length;index++){const i=items[index];const img=i.slot==='hair'?recolor(assets[index+1],'hair',PALETTES.hair[state.appearance.hair].hex):i.tint?recolor(assets[index+1],'cloth',i.tint):assets[index+1];ctx.drawImage(img,0,0);}
 if(state.equipped.top){ctx.save();ctx.clip(new Path2D(RIG.handFront));ctx.drawImage(body,0,0);ctx.restore();}
 target.width=RIG.width;target.height=RIG.height;target.getContext('2d').clearRect(0,0,RIG.width,RIG.height);target.getContext('2d').drawImage(out,0,0);
}
