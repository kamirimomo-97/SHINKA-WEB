export const avatarModels = {male:'Maschile', female:'Femminile'};
export const avatarParts = {
  torso: {base:'Base',basic:'Maglia Essenziale',technical:'Maglia Tecnica',hoodie:'Felpa'},
  legs: {base:'Intimo',basic:'Pantaloncini',technical:'Pantaloni tecnici',joggers:'Joggers'},
  feet: {base:'Piedi nudi',basic:'Training nere',technical:'Training grigie',white:'Sneakers bianche'}
};
export const legacyAvatarParts = {
  top: {none:'Solo base',basic:'Maglia Essenziale',technical:'Maglia Tecnica'},
  bottom: {none:'Intimo',basic:'Pantaloncini',technical:'Pantaloni tecnici',joggers:'Joggers'},
  shoes: {none:'Senza scarpe',basic:'Training nere',technical:'Training grigie',white:'Sneakers bianche'},
  outer: {none:'Senza felpa',hoodie:'Felpa aperta'}
};
export const avatarPresets = {
  basic: {name:'Essenziale',modules:{torso:'basic',legs:'basic',feet:'basic'}},
  technical: {name:'Tecnico',modules:{torso:'technical',legs:'technical',feet:'technical'}},
  hoodie: {name:'Felpa',modules:{torso:'hoodie',legs:'joggers',feet:'white'}},
  base: {name:'Solo base',modules:{torso:'base',legs:'base',feet:'base'}}
};
export const avatarColorPalettes = {
  skin: {
    porcelain:{name:'Porcellana',color:'#f2d8ce'},light:{name:'Chiara',color:'#f6bd93'},
    beige:{name:'Beige',color:'#dcb18b'},olive:{name:'Olivata',color:'#bba17a'},
    amber:{name:'Ambrata',color:'#bb885c'},brown:{name:'Bruna',color:'#996744'},
    dark:{name:'Scura',color:'#734c35'},deep:{name:'Ebano',color:'#4f3429'}
  },
  hair: {
    black:{name:'Neri',color:'#24232a'},darkBrown:{name:'Castano scuro',color:'#493228'},
    chestnut:{name:'Castani',color:'#925535'},blonde:{name:'Biondi',color:'#d2ac60'},
    copper:{name:'Ramati',color:'#b46b35'},red:{name:'Rossi',color:'#8c3b31'},
    gray:{name:'Grigi',color:'#929296'},white:{name:'Bianchi',color:'#e2ded8'}
  },
  eyes: {
    brown:{name:'Castani',color:'#795039'},darkBrown:{name:'Marrone scuro',color:'#42302c'},
    hazel:{name:'Nocciola',color:'#a48a47'},green:{name:'Verdi',color:'#45875b'},
    blue:{name:'Azzurri',color:'#4c89bb'},gray:{name:'Grigi',color:'#89969f'}
  }
};

export function hairStyles(model) {
  return model==='female'
    ? {classic:'Coda alta',side:'Caschetto',curly:'Afro',bald:'Rasati'}
    : {classic:'Corti spettinati',curly:'Ricci corti',side:'Corti all’indietro',bald:'Rasati'};
}

export function normalizeAppearance(avatar={}) {
  const defaults={skin:'light',hair:'chestnut',eyes:'brown'};
  return Object.fromEntries(Object.entries(defaults).map(([field,fallback])=>[
    field,Object.hasOwn(avatarColorPalettes[field],avatar[field])?avatar[field]:fallback
  ]));
}

export function normalizeAvatar(avatar={}) {
  const model=Object.hasOwn(avatarModels,avatar.model)?avatar.model:'male';
  const outfit=['basic','technical','hoodie'].includes(avatar.outfit)?avatar.outfit:'basic';
  const hairStyle=Object.hasOwn(hairStyles(model),avatar.hairStyle)?avatar.hairStyle:'classic';
  const defaults=avatarPresets[outfit].modules;
  const old=avatar.parts;
  const legacy=old?{
    torso:old.outer==='hoodie'?'hoodie':old.top==='none'?'base':old.top,
    legs:old.bottom==='none'?'base':old.bottom,
    feet:old.shoes==='none'?'base':old.shoes
  }:defaults;
  const selected=avatar.modules||legacy;
  const modules=Object.fromEntries(Object.entries(avatarParts).map(([slot,items])=>[
    slot,Object.hasOwn(items,selected[slot])?selected[slot]:defaults[slot]
  ]));
  return {styleVersion:3,model,outfit,hairStyle,...normalizeAppearance(avatar),modules};
}

export function currentPreset(avatar) {
  return Object.keys(avatarPresets).find(key=>Object.entries(avatarPresets[key].modules).every(([slot,item])=>avatar.modules[slot]===item));
}

export function avatarAsset(model,file) {
  return `assets/avatar-v3/${model}/${file}.png`;
}

export function garmentFile(slot,item) {
  return `${slot}-${item}`;
}

export function avatarModuleFiles(raw) {
  const avatar=normalizeAvatar(raw),{torso,legs,feet}=avatar.modules;
  return [`feet-${feet}-${legs}`,`legs-${legs}`,`torso-${torso}`,`head-${avatar.hairStyle}`];
}
