import {rankFrameSvg} from './rank-art.js?v=0.60.8';
import {RANKS} from './rank-system.js?v=0.60.8';
const names=[...RANKS,'SHINKA PRIME'];
export const RANK_COLORS=['#be96fa','#d7edff','#5fffb3','#74b7ff','#ff6a93','#ffd16c','#eed5ff','#d89cff'];
const colors=RANK_COLORS;
// The ten-point outline isolates the approved star and removes both banner bridges.
const hubs=[[1970,359],[1978,359],[1988,357],[1981,357],[1988,356],[1981,357],[1959,360]];
function crest(rank,id){const clip=id+'-isolated-star';if(rank===7){const outline='1494,170 1560,280 1633,245 1638,307 1715,297 1663,404 1700,510 1605,494 1495,498 1410,494 1308,510 1347,417 1263,295 1358,310 1364,248 1421,284';return '<svg viewBox="1258 160 468 365" class="rc-star" aria-hidden="true"><defs><clipPath id="'+clip+'"><polygon points="'+outline+'"/></clipPath></defs><image clip-path="url(#'+clip+')" href="assets/rank-official/prime-v2-master.png" width="1774" height="887"/></svg>';}
const [x,y]=hubs[rank],outline=[[0,-246],[94,-96],[202,-53],[128,28],[166,204],[0,133],[-174,204],[-140,29],[-234,-53],[-97,-96]].map(([dx,dy])=>(x+dx)+','+(y+dy)).join(' '),art=rankFrameSvg(rank,5,id).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');return '<svg class="rc-star" viewBox="'+(x-244)+' '+(y-250)+' 458 463" aria-hidden="true"><defs><clipPath id="'+clip+'"><polygon points="'+outline+'"/></clipPath></defs><g clip-path="url(#'+clip+')">'+art+'</g></svg>';}
const emblemName=rank=>rank===6?'Diamante<br>perlaceo':rank===7?'SHINKA<br>PRIME':names[rank];
function namePlate(rank,id){return '<span class="rc-nameplate"><span class="rc-name-text">'+emblemName(rank)+'</span></span>';}

export {crest as rankCrest,namePlate as rankNamePlate};
