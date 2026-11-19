import {MODEL,PALETTES,renderPlan,getModel} from './catalog.js?v=0.60.4';
const assets=new Map();
function load(src){if(!assets.has(src))assets.set(src,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{if(img.naturalWidth!==MODEL.width||img.naturalHeight!==MODEL.height){assets.delete(src);reject(Error('Formato immagine incompatibile'));}else resolve(img);};img.onerror=()=>{assets.delete(src);reject(Error('Immagine non disponibile. Controlla la connessione e riprova.'));};img.src=src;}));return assets.get(src);}
function canvas(){const c=document.createElement('canvas');c.width=MODEL.width;c.height=MODEL.height;return c;}
function rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
function tint(source,kind,appearance,model){const c=canvas(),ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);const data=ctx.getImageData(0,0,c.width,c.height),p=data.data;const skin=rgb(PALETTES.skin[appearance.skin].hex),hair=rgb(PALETTES.hair[appearance.hair].hex),eyes=rgb(PALETTES.eyes[appearance.eyes].hex);
 for(let i=0;i<p.length;i+=4){if(p[i+3]<16)continue;const r=p[i],g=p[i+1],b=p[i+2],lum=.2126*r+.7152*g+.0722*b;let target,anchor;
  if(kind==='hair'){if(Math.max(r,g,b)-Math.min(r,g,b)>=28||lum<22)continue;target=hair;anchor=205;}
  else{const x=(i/4)%c.width,y=Math.floor(i/4/c.width);const iris=y>170&&y<245&&model.eyes.some(([cx,cy,rx,ry])=>((x-cx)/rx)**2+((y-cy)/ry)**2<1)&&r>b+12&&lum<155;
   if(iris){if(appearance.eyes==='brown')continue;target=eyes;anchor=80;}
   else{if(appearance.skin==='original'||!(r>g+10&&g>b+7&&r-g<2.5*(g-b)+18))continue;target=skin;anchor=model.skinAnchor;}
  }
  for(let k=0;k<3;k++)p[i+k]=lum<=anchor?target[k]*lum/anchor:target[k]+(255-target[k])*(lum-anchor)/(255-anchor);
 }ctx.putImageData(data,0,0);return c;
}
export async function renderAvatar(target,raw){const plan=renderPlan(raw),model=getModel(plan.model),[bodySource,hairSource]=await Promise.all([load(plan.body),load(plan.hair)]);const body=plan.appearance.skin==='original'&&plan.appearance.eyes==='brown'?bodySource:tint(bodySource,'body',plan.appearance,model);const hair=tint(hairSource,'hair',plan.appearance,model);const result=canvas(),ctx=result.getContext('2d');
 // One complete anatomical illustration. No torso/leg/foot layers or joint masks.
 ctx.drawImage(hair,0,0);ctx.drawImage(body,0,0);
 // The lower ponytail stays behind the shoulders; the cap frames the face.
 ctx.save();ctx.beginPath();ctx.rect(...model.hairFront);ctx.clip();ctx.drawImage(hair,0,0);ctx.restore();
 target.width=MODEL.width;target.height=MODEL.height;target.getContext('2d').drawImage(result,0,0);
}
