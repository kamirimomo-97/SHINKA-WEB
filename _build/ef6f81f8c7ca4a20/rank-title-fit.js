// Presentation only. Measure the actual typeface; never shorten saved title text.
export function fitRankTitles(root=document){
 for(const title of root.querySelectorAll('.rank-banner .rank-copy .rank-title,.prime-v2 .prime-copy .rank-title')){
  const meta=title.parentElement,level=meta.querySelector('.rank-level');if(!level||!meta.clientWidth)continue;
  const gap=Number.parseFloat(getComputedStyle(meta).columnGap)||0;
  const available=Math.max(0,Math.min(meta.clientWidth*.75,meta.clientWidth-level.offsetWidth-gap));
  title.style.width='100%';title.style.maxWidth=available+'px';title.style.fontSize='';
  const base=Number.parseFloat(getComputedStyle(title).fontSize),minimum=Math.min(base,Math.max(7,base*.72));
  title.title=title.textContent;delete title.dataset.titleFit;
  const text=title.ownerDocument.createRange();text.selectNodeContents(title);
  const fits=()=>text.getBoundingClientRect().width<=title.getBoundingClientRect().width-.5;
  if(fits()){title.dataset.titleFit='full';continue;}
  let low=minimum,high=base;title.style.fontSize=minimum+'px';
  if(!fits()){title.dataset.titleFit='clipped';continue;}
  for(let i=0;i<8;i++){const mid=(low+high)/2;title.style.fontSize=mid+'px';if(fits())low=mid;else high=mid;}
  title.style.fontSize=low+'px';title.dataset.titleFit='reduced';
 }
}
// Shared by the Home, modal previews and laboratories, including transition clones.
if(typeof document!=='undefined'&&typeof MutationObserver!=='undefined'){
 let queued=false;const observed=new Set();
 const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(()=>schedule());
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const current=new Set(document.querySelectorAll('.rank-banner,.prime-v2'));for(const banner of observed)if(!current.has(banner)){resize?.unobserve(banner);observed.delete(banner);}for(const banner of current)if(!observed.has(banner)){resize?.observe(banner);observed.add(banner);}fitRankTitles(document);});}
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 document.fonts?.ready.then(schedule);document.fonts?.addEventListener('loadingdone',schedule);schedule();
}
