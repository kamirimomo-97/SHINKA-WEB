import {rankForLevel} from './rank-banner.js?v=0.60.7';
import {ENTRY,setRank,validWeek,advanceDays} from './rank-system.js?v=0.60.7';
// Manual preview controls operate only on the laboratory's temporary state.
const undoStates=new WeakMap();
export function canUndoPreview(s){return !!undoStates.get(s)?.length;}
export function previewLevel(s,delta){if(delta>0){const stack=undoStates.get(s)||[];stack.push(structuredClone(s));undoStates.set(s,stack);advanceDays(s,1,true);}else{const previous=undoStates.get(s)?.pop();if(!previous)return;for(const key of Object.keys(s))delete s[key];Object.assign(s,previous);}}

export function previewRank(s,delta){undoStates.delete(s);if(delta<0){const rank=s.prime?6:Math.max(0,s.rank-1),gems=s.prime?5:0;setRank(s,rank,gems);s.level=ENTRY[rank]+gems*(rank+1);return;}if(s.prime)return;if(s.rank<6){setRank(s,s.rank+1,0);s.level=ENTRY[s.rank];return;}setRank(s,6,5);for(let i=0;i<(s.history.length?4:8);i++)validWeek(s);}
