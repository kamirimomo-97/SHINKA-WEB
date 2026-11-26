// Approved complete image: crest, seal, seven gems and week plaque are never separated.
export const PRIME_APPROVED_ART='assets/rank-constancy/prime-approved-complete.webp';
export function primeMapWeeks(model){return model.prime?String(Math.max(0,Math.trunc(Number(model.weeks)||0))).padStart(2,'0'):'00';}
export function officialPrimeCrest(id,count='00'){
 const number=count==='00'?'<text data-prime-weeks opacity="0" x="673" y="1008">00</text>':'<defs><linearGradient id="'+id+'-week-face" x2="0" y2="1"><stop stop-color="#1c0629"/><stop offset="1" stop-color="#1c052b"/></linearGradient><linearGradient id="'+id+'-week-metal" gradientUnits="userSpaceOnUse" x1="0" y1="930" x2="0" y2="1010"><stop stop-color="#fff7da"/><stop offset=".35" stop-color="#fffdf5"/><stop offset="1" stop-color="#d9c9b1"/></linearGradient></defs><rect x="594" y="926" width="160" height="98" fill="url(#'+id+'-week-face)"/><text data-prime-weeks x="673" y="1008" text-anchor="middle" fill="url(#'+id+'-week-metal)" stroke="#cda960" stroke-width=".8" paint-order="stroke fill" font-family="Georgia,serif" font-size="'+Math.min(96,248/count.length)+'" font-weight="400">'+count+'</text>';
 return '<svg viewBox="0 0 1347 1167" data-prime-unit aria-hidden="true"><image href="'+PRIME_APPROVED_ART+'" width="1347" height="1167"/>'+number+'</svg>';
}
export function officialPrimeMap(model,scene,id){
 if(!scene.bakedHeader)return '';
 const count=primeMapWeeks(model),label=model.prime?count+' settimane consecutive mantenute':'PRIME non attivo, zero settimane mantenute';
 return '<div class="rc-official-prime'+(model.states?.[7]==='future'?' rc-rank-obscured':'')+'" data-prime-official data-representative-gems="7" role="img" aria-label="SHINKA PRIME ufficiale, sette gemme rappresentative, '+label+'"><div class="rc-prime-crest" style="left:'+586/scene.width*100+'%;top:'+400/scene.height*100+'%;width:'+198/scene.width*100+'%;aspect-ratio:1347/1167">'+officialPrimeCrest(id,count)+'</div></div>';
}
