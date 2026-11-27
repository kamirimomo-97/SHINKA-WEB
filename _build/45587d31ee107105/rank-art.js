import * as rank0 from './rank-v2/acciaio.js?v=0.60.10';
import * as rank1 from './rank-v2/argento.js?v=0.60.10';
import * as rank2 from './rank-v2/smeraldo.js?v=0.60.10';
import * as rank3 from './rank-v2/zaffiro.js?v=0.60.10';
import * as rank4 from './rank-v2/rubino.js?v=0.60.10';
import * as rank5 from './rank-v2/oro.js?v=0.60.10';
import * as rank6 from './rank-v2/diamante.js?v=0.60.10';
// Approved individual masters. No atlas or neighboring rank crops.
export const rankAssetIds=Object.freeze(["acciaio","argento","smeraldo","zaffiro","rubino","oro","diamante"]);
export function rankAsset(rank,gems=5){const r=Math.max(0,Math.min(6,Math.trunc(Number(rank)||0))),g=Math.max(0,Math.min(5,Math.trunc(Number(gems)||0)));return 'assets/rank-v2/states/'+rankAssetIds[r]+'-'+g+'.svg';}
export const rankAssetFiles=Object.freeze(rankAssetIds.flatMap((_,r)=>Array.from({length:6},(_,g)=>rankAsset(r,g))));

const artwork=[rank0,rank1,rank2,rank3,rank4,rank5,rank6];
export function rankFrameSvg(rank,gems,prefix){const r=Math.max(0,Math.min(6,Math.trunc(Number(rank)||0)));return artwork[r].stateSvg(gems,prefix).replace('<svg ','<svg class="rank-frame" aria-hidden="true" ');}
