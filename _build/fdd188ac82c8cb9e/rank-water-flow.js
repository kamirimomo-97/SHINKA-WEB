// GPU texture advection inside water-only masks. No particles or drawn ripple shapes.
import {WATER_OUTLINES,MOBILE_WATER_OUTLINES,REFERENCE_WATER_OUTLINES,waterConfidence} from './rank-water-mask.js?v=0.60.11';
const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=vec2((position.x+1.0)*.5,(1.0-position.y)*.5);gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision mediump float;
varying vec2 uv;uniform sampler2D picture;uniform sampler2D waterMask;uniform vec2 sourceSize;uniform vec2 sceneSize;uniform vec2 origin;uniform float time;
void main(){float alpha=smoothstep(.45,.98,texture2D(waterMask,uv).r);if(alpha<.005){gl_FragColor=vec4(0.);return;}
vec2 p=origin+uv*sceneSize;float a=fract(time*.43),b=fract(a+.5);float blend=1.0-abs(a*2.0-1.0);blend=blend*blend*(3.0-2.0*blend);
float sway=sin(p.y*.045-time*2.4)*2.4+sin(p.y*.09-time*3.1)*.8;
vec2 pa=p+vec2(sway,-(a-.5)*64.0),pb=p+vec2(sway,-(b-.5)*64.0);
vec3 base=texture2D(picture,p/sourceSize).rgb;
vec2 ua=(pa-origin)/sceneSize,ub=(pb-origin)/sceneSize;
float gateA=smoothstep(.7,.98,texture2D(waterMask,ua).r),gateB=smoothstep(.7,.98,texture2D(waterMask,ub).r);
gateA*=step(0.0,ua.x)*step(ua.x,1.0)*step(0.0,ua.y)*step(ua.y,1.0);gateB*=step(0.0,ub.x)*step(ub.x,1.0)*step(0.0,ub.y)*step(ub.y,1.0);
vec3 sampleA=mix(base,texture2D(picture,pa/sourceSize).rgb,gateA);
vec3 sampleB=mix(base,texture2D(picture,pb/sourceSize).rgb,gateB);
vec3 colour=mix(sampleB,sampleA,blend);
float shimmer=sin(p.y*.13-time*5.2+sin(p.x*.08));colour*=1.0+.055*shimmer;
gl_FragColor=vec4(colour,alpha*.96);}`;
export function startWaterFlow(canvas){let disposed=false,raf=0,gl=null,frameCount=0,lastDraw=0,elapsed=0,lastTick=0;const resources=[];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const stop=()=>{cancelAnimationFrame(raf);raf=0;lastTick=0;};
 const state=s=>{canvas.dataset.waterState=s;};
 function draw(now){raf=0;if(disposed||document.hidden||reduced.matches)return;
  if(!canvas.isConnected){dispose();return;}const paused=!!canvas.closest('.rc-screen')?.querySelector('.rc-dialog[open]');
  if(!paused&&lastTick)elapsed+=Math.min((now-lastTick)/1000,.1);if(!paused&&now-lastDraw>=1000/30){gl.uniform1f(resources.time,elapsed);gl.drawArrays(gl.TRIANGLES,0,6);lastDraw=now;frameCount++;if(frameCount%10===0)canvas.dataset.waterFrames=String(frameCount);state('running');}else if(paused)state('paused');
  lastTick=now;raf=requestAnimationFrame(draw);
 }
 function resume(){stop();if(disposed)return;if(reduced.matches){canvas.dataset.waterEngine='reduced';state('reduced');return;}if(!gl)return;canvas.dataset.waterEngine='active';if(!document.hidden)raf=requestAnimationFrame(draw);}
 const visibility=()=>document.hidden?stop():resume();
 function dispose(){if(disposed)return;disposed=true;stop();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',resume);canvas.removeEventListener('webglcontextlost',lost);for(const item of resources){if(item.kind==='texture')gl?.deleteTexture(item.value);if(item.kind==='buffer')gl?.deleteBuffer(item.value);if(item.kind==='shader')gl?.deleteShader(item.value);if(item.kind==='program')gl?.deleteProgram(item.value);}}
 function lost(event){event.preventDefault();stop();canvas.dataset.waterEngine='fallback';state('fallback');}
 
 try{gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,powerPreference:'low-power'});if(!gl)throw Error('No WebGL');
  const shader=(type,source)=>{const sh=gl.createShader(type);resources.push({kind:'shader',value:sh});gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;};
  const program=gl.createProgram();resources.push({kind:'program',value:program});gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const buffer=gl.createBuffer();resources.push({kind:'buffer',value:buffer});gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const width=Number(canvas.dataset.sceneWidth),height=Number(canvas.dataset.sceneHeight),ox=Number(canvas.dataset.originX),oy=Number(canvas.dataset.originY);
  canvas.width=Math.min(640,Math.max(320,Math.round(canvas.parentElement.clientWidth*1.4)));canvas.height=Math.round(canvas.width*height/width);gl.viewport(0,0,canvas.width,canvas.height);
  const mask=document.createElement('canvas');mask.width=canvas.width;mask.height=canvas.height;const context=mask.getContext('2d');context.scale(canvas.width/width,canvas.height/height);context.translate(-ox,-oy);context.fillStyle='white';for(const path of (canvas.dataset.waterLayout==='reference'?REFERENCE_WATER_OUTLINES:canvas.dataset.waterLayout==='mobile'?MOBILE_WATER_OUTLINES:WATER_OUTLINES))context.fill(new Path2D(path));
  const texture=(unit,image)=>{const tex=gl.createTexture();resources.push({kind:'texture',value:tex});gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);};
  gl.uniform1i(gl.getUniformLocation(program,'waterMask'),1);gl.uniform2f(gl.getUniformLocation(program,'sceneSize'),width,height);gl.uniform2f(gl.getUniformLocation(program,'origin'),ox,oy);resources.time=gl.getUniformLocation(program,'time');
  const image=new Image();image.onload=()=>{if(disposed)return;try{
   const photo=document.createElement('canvas');photo.width=image.naturalWidth;photo.height=image.naturalHeight;const photoContext=photo.getContext('2d',{willReadFrequently:true});photoContext.drawImage(image,0,0);const pixels=photoContext.getImageData(0,0,photo.width,photo.height).data;
   const coverage=context.getImageData(0,0,mask.width,mask.height),raw=new Float32Array(mask.width*mask.height);
   for(let y=0;y<mask.height;y++)for(let x=0;x<mask.width;x++){const n=y*mask.width+x;if(!coverage.data[n*4+3])continue;const sx=Math.min(photo.width-1,Math.max(0,Math.round(ox+(x+.5)*width/mask.width))),sy=Math.min(photo.height-1,Math.max(0,Math.round(oy+(y+.5)*height/mask.height))),k=(sy*photo.width+sx)*4;raw[n]=coverage.data[n*4+3]/255*waterConfidence(pixels[k],pixels[k+1],pixels[k+2]);}
   let count=0;for(let y=0;y<mask.height;y++)for(let x=0;x<mask.width;x++){const n=y*mask.width+x;let confidence=0;if(x>0&&x<mask.width-1&&y>0&&y<mask.height-1){confidence=raw[n];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)confidence=Math.min(confidence,raw[n+dy*mask.width+dx]);}const k=n*4,v=Math.round(confidence*255);coverage.data[k]=coverage.data[k+1]=coverage.data[k+2]=v;coverage.data[k+3]=255;if(v>8)count++;}context.putImageData(coverage,0,0);canvas.dataset.waterPixels=String(count);texture(1,mask);
   texture(0,image);gl.uniform1i(gl.getUniformLocation(program,'picture'),0);gl.uniform2f(gl.getUniformLocation(program,'sourceSize'),image.naturalWidth,image.naturalHeight);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',resume);canvas.addEventListener('webglcontextlost',lost);resume();}catch(error){canvas.dataset.waterEngine='fallback';state('fallback');dispose();}};image.onerror=()=>{canvas.dataset.waterEngine='fallback';state('fallback');dispose();};image.src=canvas.dataset.waterSource;
 }catch(error){canvas.dataset.waterEngine='fallback';canvas.dataset.waterError=error.message;state('fallback');dispose();}
 return dispose;
}
