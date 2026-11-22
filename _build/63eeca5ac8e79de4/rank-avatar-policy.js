// Preview policy: raised-hand poses remain behind the frame.
export const handPoseElements=Object.freeze(['nature','wind','lightning']);
const supported=new Set(['neutral','fire','water','nature','wind','earth','lightning','shadow','ice','light']);
export function recommendedAvatarPopout(element){return supported.has(element)&&!handPoseElements.includes(element);}

// Eye landmarks in the shared 768x1152 source canvas; only significant pose offsets override the family anchor.
export function previewEyeAnchor(id,element){if(element==='lightning'){if(id==='02')return [375,132];if(id==='06')return [370,195];if(id==='08')return [365,155];return [375,Number(id)<=5?150:165];}return [384,Number(id)<=5?100:120];}
