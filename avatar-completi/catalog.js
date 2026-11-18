export const MODEL={id:'female-complete-v1',name:'Femminile',defaultHair:'bob',width:1024,height:1536,hairFront:[0,0,1024,330],skinAnchor:160,eyes:[[471,211,12,18],[548,210,12,18]],outfitPreview:[220,305,580,1180]};
const root='assets/avatar-completi/female-v1/';
export const OUTFITS={essential:{name:'Essenziale',description:'Maglia, shorts e training',asset:root+'essential.png'},technical:{name:'Tecnico',description:'Maglia tecnica e leggings',asset:root+'technical.png'},hoodie:{name:'Felpa',description:'Felpa, joggers e sneakers',asset:root+'hoodie.png'}};
export const HAIRSTYLES={bob:{name:'Caschetto',asset:root+'hair-bob.png'},ponytail:{name:'Coda alta',asset:root+'hair-ponytail.png'},curly:{name:'Ricci',asset:root+'hair-curly.png'}};
export const MODELS={
 'female-complete-v1':MODEL,
 'male-complete-v1':{id:'male-complete-v1',name:'Maschile',defaultHair:'classic',width:1024,height:1536,hairFront:[0,0,1024,330],skinAnchor:195,eyes:[[475,211,12,18],[540,209,12,18]],outfitPreview:[210,270,600,1220]}
};
const maleRoot='assets/avatar-completi/male-v1/';
export const MALE_OUTFITS={essential:{name:'Essenziale',description:'Maglia, shorts e training',asset:maleRoot+'essential.png'},technical:{name:'Tecnico',description:'Maglia tecnica e pantaloni',asset:maleRoot+'technical.png'},hoodie:{name:'Felpa',description:'Felpa, joggers e sneakers',asset:maleRoot+'hoodie.png'}};
export const MALE_HAIRSTYLES={classic:{name:'Corti spettinati',asset:maleRoot+'hair-classic.png'},curly:{name:'Ricci corti',asset:maleRoot+'hair-curly.png'},back:{name:'Corti all’indietro',asset:maleRoot+'hair-back.png'}};
export function getModel(id){return Object.hasOwn(MODELS,id)?MODELS[id]:MODEL;}
export function getOutfits(id){return id==='male-complete-v1'?MALE_OUTFITS:OUTFITS;}
export function getHairstyles(id){return id==='male-complete-v1'?MALE_HAIRSTYLES:HAIRSTYLES;}
export const PALETTES={skin:{original:{name:'Originale',hex:'#cb8f65'},light:{name:'Chiara',hex:'#edbb98'},beige:{name:'Beige',hex:'#dcb18b'},olive:{name:'Olivata',hex:'#b88c65'},brown:{name:'Bruna',hex:'#95613f'},deep:{name:'Ebano',hex:'#533829'}},hair:{silver:{name:'Argento',hex:'#dddce1'},black:{name:'Neri',hex:'#29262e'},brown:{name:'Castani',hex:'#805139'},blonde:{name:'Biondi',hex:'#cfac68'},copper:{name:'Ramati',hex:'#a55e3d'}},eyes:{brown:{name:'Castani',hex:'#795039'},green:{name:'Verdi',hex:'#4c875d'},blue:{name:'Azzurri',hex:'#508cbb'}}};
export const STORAGE_KEY='shinka-avatar-completi-v1';
export function initialState(modelId=MODEL.id){const model=getModel(modelId);return {version:1,model:model.id,outfit:'essential',hairstyle:model.defaultHair,appearance:{skin:'original',hair:'silver',eyes:'brown'}};}
export function normalizeState(raw){if(raw?.version!==1||!Object.hasOwn(MODELS,raw.model))return initialState();const state=initialState(raw.model);if(Object.hasOwn(getOutfits(raw.model),raw.outfit))state.outfit=raw.outfit;if(Object.hasOwn(getHairstyles(raw.model),raw.hairstyle))state.hairstyle=raw.hairstyle;for(const field of Object.keys(PALETTES))if(Object.hasOwn(PALETTES[field],raw.appearance?.[field]))state.appearance[field]=raw.appearance[field];return state;}
export function chooseModel(raw,id){if(!Object.hasOwn(MODELS,id))throw Error('Modello non disponibile');return normalizeState({...normalizeState(raw),model:id});}
export function chooseOutfit(raw,id){const state=normalizeState(raw);if(!Object.hasOwn(getOutfits(state.model),id))throw Error('Completo non disponibile');state.outfit=id;return state;}
export function chooseHair(raw,id){const state=normalizeState(raw);if(!Object.hasOwn(getHairstyles(state.model),id))throw Error('Taglio non disponibile');state.hairstyle=id;return state;}
export function renderPlan(raw){const state=normalizeState(raw);return {model:state.model,body:getOutfits(state.model)[state.outfit].asset,hair:getHairstyles(state.model)[state.hairstyle].asset,appearance:state.appearance};}
