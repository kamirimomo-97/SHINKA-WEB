// Presentation only: historical unlocks stay visible; inspecting never unlocks a rank.
export const LOCK_DARKNESS=.68;
const stars=[[194,1349,148,144],[536,1206,152,148],[210,1043,148,140],[573,936,148,133],[267,775,144,134],[624,687,143,124],[360,560,133,123]];
const plates=[[140,1509,264,89],[494,1365,277,83],[155,1192,270,78],[522,1081,264,79],[211,924,268,77],[585,817,241,78],[313,692,255,78],[548,568,281,75]];
const star=[[.5,0],[.67,.28],[1,.4],[.77,.63],[.85,.98],[.5,.81],[.14,.98],[.22,.63],[0,.4],[.33,.28]];
const rim=[[.06,0],[.94,0],[1,.2],[1,.8],[.94,.94],[.55,.94],[.5,1],[.45,.94],[.06,.94],[0,.8],[0,.2]];
const points=([x,y,w,h],shape)=>shape.map(([px,py])=>(x+px*w)+','+(y+py*h)).join(' ');
export function lockedRanks(model){return model.states.flatMap((state,i)=>state==='future'?[i]:[]);}
export function rankVisibility(model,scene,id){if(!scene.bakedHeader)return '';return '<svg class="rc-rank-locks" viewBox="0 0 '+scene.width+' '+scene.height+'" aria-hidden="true"><defs><filter id="'+id+'-lock-soft"><feGaussianBlur stdDeviation="1"/></filter></defs>'+lockedRanks(model).map(i=>'<g class="rc-rank-dim" data-rc-dim="'+i+'" filter="url(#'+id+'-lock-soft)">'+(i<7?'<polygon points="'+points(stars[i],star)+'"/>':'')+'<polygon points="'+points(plates[i],rim)+'"/></g>').join('')+'</svg>';}
export function rankRevealOffset({rankBox,sceneHeight,worldHeight,worldTop,viewportHeight,sheetHeight}){
 if(!rankBox||sheetHeight<=0)return 0;
 const bottom=worldTop+(rankBox[1]+rankBox[3])/sceneHeight*worldHeight;
 return Math.max(0,bottom-(viewportHeight-sheetHeight)+12);
}
