// Keep approved scene pixels except localized petal repairs and the requested larger tree.
const repairs=[[295,214,13,10],[251,265,16,12],[289,591,17,12],[364,619,17,12],[293,812,18,12],[123,886,18,13],[222,1294,21,15]];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;');
export function rankSceneArt(scene,id){const width=scene.sourceWidth||scene.width,height=scene.sourceHeight||scene.height;
let art=`<image href="${esc(scene.src)}" width="${width}" height="${height}"/>`;
if(scene.cleanupSrc)art+=`<defs><radialGradient id="${id}-repair-edge"><stop offset=".78" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="${id}-repair" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">${repairs.map(([cx,cy,rx,ry])=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}-repair-edge)"/>`).join('')}</mask></defs><image href="${esc(scene.cleanupSrc)}" width="${width}" height="${height}" mask="url(#${id}-repair)"/>`;
if(scene.treeSrc)art+=`<defs><filter id="${id}-tree-edge" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="4"/></filter><mask id="${id}-tree" maskUnits="userSpaceOnUse" x="98" y="138" width="450" height="460"><path d="M80 120H540V265L480 340 355 391 245 425 198 590H80Z" fill="white" filter="url(#${id}-tree-edge)"/></mask></defs><image href="${esc(scene.treeSrc)}" x="${scene.treeRect?.[0]||0}" y="${scene.treeRect?.[1]||0}" width="${scene.treeRect?.[2]||width}" height="${scene.treeRect?.[3]||height}" mask="url(#${id}-tree)"/>`;
return art;}
