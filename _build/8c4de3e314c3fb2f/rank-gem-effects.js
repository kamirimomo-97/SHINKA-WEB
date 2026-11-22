const colors=['#ce8dff','#c3e9ff','#39ff99','#459bff','#ff4875','#ffd45a','#eee0ff'];
export function awardedGemIndices(before,after){if(!before||before.prime||after.prime||before.rank!==after.rank||after.gems<=before.gems)return [];return Array.from({length:Math.min(5,after.gems)-Math.max(0,before.gems)},(_,i)=>Math.max(0,before.gems)+i+1);}
export function celebrateGems(root,before,after){const earned=awardedGemIndices(before,after);if(!earned.length||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const banner=root.querySelector('.rank-banner'),frame=banner?.querySelector('.rank-frame');if(!frame)return;
 const ns='http://www.w3.org/2000/svg',overlay=document.createElementNS(ns,'svg');overlay.classList.add('gem-celebration');overlay.setAttribute('viewBox','0 115 2172 450');overlay.setAttribute('aria-hidden','true');overlay.style.setProperty('--gem-color',colors[after.rank]);
 for(const index of earned){const gem=frame.querySelector('.gem-slot[data-gem="'+index+'"]');if(!gem)continue;const clip=gem.getAttribute('clip-path')?.slice(5,-1),polygon=clip?frame.querySelector('[id="'+clip+'"] polygon'):null;if(!polygon)continue;const vertices=polygon.getAttribute('points').trim().split(/\s+/).map(p=>p.split(',').map(Number));const x=vertices.reduce((sum,p)=>sum+p[0],0)/vertices.length,y=vertices.reduce((sum,p)=>sum+p[1],0)/vertices.length;
 gem.style.setProperty('--gem-origin',x+'px '+y+'px');gem.style.setProperty('--gem-color',colors[after.rank]);gem.classList.add('gem-awarded');
 const ring=document.createElementNS(ns,'circle');ring.setAttribute('cx',x);ring.setAttribute('cy',y);ring.setAttribute('r','23');ring.style.setProperty('--gem-origin',x+'px '+y+'px');ring.classList.add('gem-impact');overlay.append(ring);
 for(let i=0;i<10;i++){const angle=i*Math.PI/5,dx=Math.cos(angle)*100,dy=Math.sin(angle)*100,spark=document.createElementNS(ns,'path');spark.setAttribute('d','M'+(x-6)+' '+y+'h12M'+x+' '+(y-6)+'v12');spark.style.setProperty('--spark-x',dx+'px');spark.style.setProperty('--spark-y',dy+'px');spark.classList.add('gem-spark');overlay.append(spark);}
 setTimeout(()=>gem.classList.remove('gem-awarded'),1150);
 }banner.append(overlay);setTimeout(()=>overlay.remove(),1150);
}

// One tracker per app instance. Navigation and identity edits cannot replay an award.
export function createGemTracker(effect=celebrateGems){let previous=null;return (root,state)=>{const next={rank:state.rank,gems:state.gems,prime:!!state.prime};if(previous===null){previous=next;return;}if(!root?.querySelector?.('.rank-banner'))return;const before=previous;previous=next;effect(root,before,next);};}

