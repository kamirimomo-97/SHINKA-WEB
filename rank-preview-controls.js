import {rankForLevel} from './rank-banner.js';
import {ENTRY,setRank,validWeek} from './rank-system.js';
// Manual preview controls operate only on the laboratory's temporary state.
export function previewLevel(s,delta){const level=Math.max(0,s.level+Math.sign(delta));const state=rankForLevel(level);setRank(s,state.rank,state.gems);s.level=level;s.partial=state.gems===5?0:(level-ENTRY[state.rank])%(state.rank+1);}
export function previewRank(s,delta){if(delta<0){const rank=s.prime?6:Math.max(0,s.rank-1),gems=s.prime?5:0;setRank(s,rank,gems);s.level=ENTRY[rank]+gems*(rank+1);return;}if(s.prime)return;if(s.rank<6){setRank(s,s.rank+1,0);s.level=ENTRY[s.rank];return;}setRank(s,6,5);for(let i=0;i<(s.history.length?4:8);i++)validWeek(s);}
