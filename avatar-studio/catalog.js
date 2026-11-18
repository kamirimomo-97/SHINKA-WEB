export const RIG={id:'female-v1',width:1024,height:1536,body:'assets/avatar-studio/female-v1/body.png',handFront:'M686 647 L660 634 L621 626 L587 631 L555 643 Q545 651 553 659 L580 653 L556 671 Q550 677 557 684 L582 674 L565 690 Q563 697 571 700 L599 687 L590 700 Q591 707 602 706 L635 697 L664 697 L684 678 Z'};
const root='assets/avatar-studio/female-v1/';
// Art is registered on the complete rig canvas. Never trim or independently scale attachments.
export const ITEMS=[
 {id:'top-essential',slot:'top',name:'Maglia Essenziale',rig:RIG.id,asset:root+'tee.png',layer:30,occludes:['shoulderCaps'],bounds:[320,320,400,460],unlock:{type:'starter'}},
 {id:'top-amethyst',slot:'top',name:'Maglia Ametista',rig:RIG.id,asset:root+'tee.png',layer:30,occludes:['shoulderCaps'],tint:'#78618d',bounds:[320,320,400,460],unlock:{type:'playerLevel',value:5}},
 {id:'bottom-essential',slot:'bottom',name:'Shorts Essenziale',rig:RIG.id,asset:root+'shorts.png',layer:20,bounds:[330,700,340,210],unlock:{type:'starter'}},
 {id:'feet-essential',slot:'feet',name:'Training Essenziale',rig:RIG.id,asset:root+'shoes.png',layer:10,occludes:['feet'],bounds:[310,1280,370,220],unlock:{type:'starter'}},
 {id:'hair-bob',slot:'hair',name:'Caschetto',rig:RIG.id,asset:root+'hair.png',layer:50,bounds:[370,65,280,260],unlock:{type:'starter'}}
];
export const SLOTS={top:'Maglie',bottom:'Pantaloni',feet:'Scarpe',hair:'Capelli'};
export const PALETTES={skin:{original:{label:'Originale',hex:'#cb8f65'},light:{label:'Chiara',hex:'#edbb98'},olive:{label:'Olivata',hex:'#b88c65'},brown:{label:'Bruna',hex:'#95613f'},deep:{label:'Ebano',hex:'#533829'}},hair:{silver:{label:'Argento',hex:'#dddce1'},black:{label:'Neri',hex:'#29262e'},brown:{label:'Castani',hex:'#805139'},blonde:{label:'Biondi',hex:'#cfac68'},copper:{label:'Ramati',hex:'#a55e3d'}},eyes:{brown:{label:'Castani',hex:'#795039'},green:{label:'Verdi',hex:'#4c875d'},blue:{label:'Azzurri',hex:'#508cbb'}}};
export const STORAGE_KEY='shinka-avatar-studio-v1';
export function initialState(){return {version:1,rig:RIG.id,appearance:{skin:'original',hair:'silver',eyes:'brown'},equipped:{top:'top-essential',bottom:'bottom-essential',feet:'feet-essential',hair:'hair-bob'},owned:ITEMS.filter(i=>i.unlock.type==='starter').map(i=>i.id),demoLevel:0};}
export function normalizeState(raw){
 const s=initialState();if(!raw||raw.version!==1||raw.rig!==RIG.id)return s;
 for(const key of Object.keys(PALETTES))if(Object.hasOwn(PALETTES[key],raw.appearance?.[key]))s.appearance[key]=raw.appearance[key];
 // Unlock state is isolated prototype data; never read or mutate real training progression.
 s.owned=[...new Set([...s.owned,...(Array.isArray(raw.owned)?raw.owned:[]).filter(id=>ITEMS.some(i=>i.id===id))])];
 s.demoLevel=[0,5].includes(raw.demoLevel)?raw.demoLevel:0;
 for(const slot of Object.keys(SLOTS)){const id=raw.equipped?.[slot];if(id===null||ITEMS.some(i=>i.id===id&&i.slot===slot&&i.rig===RIG.id&&s.owned.includes(id)))s.equipped[slot]=id;}
 return s;
}
export function equip(state,id,slot){const s=normalizeState(state);if(!Object.hasOwn(SLOTS,slot))throw Error('Categoria non valida');if(id!==null&&!ITEMS.some(i=>i.id===id&&i.slot===slot&&i.rig===s.rig&&s.owned.includes(id)))throw Error('Capo non disponibile');s.equipped[slot]=id;return s;}
export function claimEligible(state,level){const s=normalizeState(state);s.demoLevel=level>=5?5:0;for(const i of ITEMS)if(i.unlock.type==='playerLevel'&&level>=i.unlock.value&&!s.owned.includes(i.id))s.owned.push(i.id);return s;}
export function selectedItems(state){return ITEMS.filter(i=>Object.values(state.equipped).includes(i.id)).sort((a,b)=>a.layer-b.layer);}
