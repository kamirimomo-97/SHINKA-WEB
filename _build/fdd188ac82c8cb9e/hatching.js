export const CRACK_INTERVAL=700,SKIP_DELAY=1000,FINALE_DURATION=2400;
export const newHatch=()=>({key:null,taps:0,readyAt:0,finaleAt:0,phase:'choose'});
export const canSkipHatch=(s,now)=>s.phase==='finale'&&now>=s.finaleAt+SKIP_DELAY;
export function tapHatch(s,key,now){
 if(s.phase==='revealed'||s.phase==='finale'||now<s.readyAt||s.key&&s.key!==key)return s;
 const taps=s.taps+1;
 return {...s,key,taps,readyAt:now+CRACK_INTERVAL,phase:taps===4?'finale':'shell',finaleAt:taps===4?now:0};
}
export const finishHatch=s=>s.phase==='finale'?{...s,phase:'revealed'}:s;
