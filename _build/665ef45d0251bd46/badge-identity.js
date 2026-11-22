export const PROFILE_KEY='shinka-lab-v1';
export function identityFrom(db){return {name:typeof db?.athlete?.name==='string'&&db.athlete.name.trim()?db.athlete.name.trim().slice(0,60):'Allenatore',avatar:db?.avatar&&typeof db.avatar==='object'&&!Array.isArray(db.avatar)?db.avatar:null,hasProfile:!!db};}
export function readIdentity(storage){try{const raw=storage.getItem(PROFILE_KEY);return identityFrom(raw?JSON.parse(raw):null);}catch{return identityFrom(null);}}
