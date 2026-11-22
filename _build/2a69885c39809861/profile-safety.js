// Invalid or inaccessible storage must never be replaced by a fresh profile.
export function loadProtectedProfile(storage,parse,initial){let raw=null;try{raw=storage.getItem('shinka-lab-v1');return {data:raw===null?initial():parse(raw),raw,blocked:false};}catch(error){return {data:initial(),raw,blocked:true,error};}}
export function restoreProtectedProfile(storage,text,parse){const next=parse(text);storage.setItem('shinka-lab-v1',JSON.stringify(next));return next;}
