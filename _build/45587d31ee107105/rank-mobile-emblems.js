// The exact approved painted emblems, isolated with native SVG clips. Never stretched.
export const MOBILE_EMBLEMS=[
 {crop:[275,1055,120,115],at:[260,1642,180]},
 {crop:[588,937,118,112],at:[576,1437,180]},
 {crop:[308,796,117,115],at:[231,1236,180]},
 {crop:[646,692,116,114],at:[575,1060,180]},
 {crop:[388,568,116,111],at:[259,876,180]},
 {crop:[705,481,116,113],at:[591,710,180]},
 {crop:[485,370,120,104],at:[298,533,180]},
 {crop:[696,253,150,116],at:[582,344,210]}
];
const star=[[.5,0],[.67,.27],[1,.4],[.77,.63],[.85,.98],[.5,.81],[.14,.98],[.22,.63],[0,.4],[.33,.27]];
const prime=[[.5,0],[.65,.31],[.83,.2],[.8,.45],[1,.4],[.89,.7],[.74,.92],[.5,1],[.26,.92],[.1,.7],[0,.4],[.2,.45],[.16,.2],[.35,.31]];
export function mobileRankEmblems(scene,id){if(!scene.mobile)return '';return '<div class="rc-mobile-emblems" aria-hidden="true">'+MOBILE_EMBLEMS.map(({crop:[x,y,w,h],at:[cx,bottom,size]},i)=>{const clip=id+'-official-emblem-'+i,points=(i===7?prime:star).map(([px,py])=>(x+px*w)+','+(y+py*h)).join(' ');return '<svg class="rc-original-emblem" data-emblem="'+i+'" viewBox="'+[x,y,w,h].join(' ')+'" style="left:'+100*cx/scene.width+'%;top:'+100*bottom/scene.height+'%;width:calc(var(--rc-unit)*'+size+');aspect-ratio:'+w+'/'+h+'"><defs><clipPath id="'+clip+'"><polygon points="'+points+'"/></clipPath></defs><image href="'+scene.emblemSrc+'" width="1086" height="1448" clip-path="url(#'+clip+')"/></svg>';}).join('')+'</div>';}
