export const steelAssets=Object.freeze(Array.from({length:6},(_,n)=>`assets/rank-demo/acciaio-frame-v4/acciaio-${n}-gemme.png`));
export function gemCount(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(5,Math.floor(n))):0;}
export function steelAsset(value){return steelAssets[gemCount(value)];}
