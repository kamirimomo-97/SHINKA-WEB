// Visible artwork bounds keep the contact plane consistent across differently sized cutouts.
const bounds={yukiro:[180,0,1125,1017,1536,1024],hyogara:[42,21,1434,984,1536,1024],hyokaiser:[0,0,1312,1199,1312,1199],himori:[246,24,1218,852,1774,887],magarok:[96,24,1080,1086,1398,1125],kaguryon:[90,12,1230,1008,1536,1024],mizuro:[138,54,972,1062,1312,1199],mizurai:[384,24,1506,678,2172,724],mizuryon:[270,24,1068,990,1536,1024],komori:[306,84,828,816,1536,1024],morika:[240,78,1038,870,1536,1024],daijurin:[212,2,1143,1014,1536,1024],soripi:[90,42,1110,1026,1337,1176],sorakaze:[210,42,1230,942,1536,1024],soraryu:[48,12,1452,1002,1536,1024],bisonel:[219,39,1047,933,1536,1024],rocabison:[147,21,1218,945,1536,1024],terrabison:[81,6,1407,996,1536,1024],raikon:[201,9,1059,981,1536,1024],raidenko:[60,6,1365,1002,1536,1024],raijuryu:[129,6,1203,1017,1536,1024],yumori:[270,72,768,996,1312,1199],yumbral:[132,54,1026,1092,1312,1199],noctyron:[108,12,1326,1002,1536,1024]};
export function creatureWindow(name){return bounds[name.toLowerCase()]?.slice();}
const surfaces={
 ice:'<path d="M78 58l16-35 19 31 41-38 22 42 48-32 23 38 41-35 29 34" fill="#8ac5ed" stroke="#d8f6ff" stroke-width="2"/>',
 fire:'<path d="M78 40l52 13-19 18m150-40-32 19 28 18m-70-47 12 24-18 20" class="platform-vein"/><path d="M62 62l44 7m188-7 39-9" class="platform-vein"/>',
 water:'<ellipse cx="200" cy="48" rx="139" ry="23" class="platform-ripple"/><path d="M66 48q30-13 59-5m149 15q31 2 59-10" class="platform-vein"/>',
 nature:'<path d="M60 53q33-20 70-13t75-4q50-9 106 7l22 15q-60 13-112 8T60 53" fill="#395b34" opacity=".8"/><path d="M91 68q26-28 51-24m132 23q-21-20-10-31" stroke="#a5b174" stroke-width="3" fill="none"/><path d="M117 45q-20-20-29-5 10 12 29 5m153-2q21-20 31-5-10 12-31 5" fill="#7ba65b"/>',
 wind:'<path d="M78 50q57-30 116-6t130-5M100 65q69-22 116-6t84-7" class="platform-vein"/><path d="M68 35l28-9m203 7 23-6" class="platform-ripple"/>',
 earth:'<path d="M55 48l42-18 43 6 45-16 66 9 44-2 50 23-38 19-65-6-52 12-70-9-36 1Z" fill="#5d584c"/><path d="M97 30l23 36m65-46 5 55m61-46-9 34" stroke="#292c2b" stroke-width="3"/><path d="M74 49l9-18 10 17-9 10m211-14 10-19 13 19-13 13" fill="#8da48d"/>',
 lightning:'<path d="M71 49l58-12-16 17 66-12m49 18 31-20-4 14 67-14" class="platform-vein"/><path d="M98 64l20-4m167-29 22-4" class="platform-vein"/>',
 shadow:'<ellipse cx="200" cy="48" rx="126" ry="23" class="platform-ripple"/><ellipse cx="200" cy="48" rx="80" ry="15" class="platform-ripple"/><path d="M80 47l18-9 13 11-18 9Zm209 0 18-9 13 11-18 9Z" fill="none" stroke="currentColor" stroke-width="2"/>'
};
export function homePlatform(key,name,illustrated=false){
 const b=bounds[name.toLowerCase()];
 if(illustrated)return illustratedHabitat(key,name,b);
 const floating=key==='shadow'||key==='wind';
 return `<link rel="preload" as="image" href="assets/shinkaryu/${name.toLowerCase()}.png" fetchpriority="high"><div class="home-habitat ${floating?'is-hovering':''}"><svg class="home-platform" viewBox="0 0 400 130" aria-hidden="true" focusable="false"><defs><linearGradient id="pl-side-${key}" x2="0" y2="1"><stop stop-color="#343c40"/><stop offset="1" stop-color="#101719"/></linearGradient><radialGradient id="pl-top-${key}"><stop stop-color="#3a494b"/><stop offset="1" stop-color="#202b30"/></radialGradient></defs><ellipse cx="200" cy="101" rx="166" ry="16" fill="#000" opacity=".25"/><path d="M28 48v24c0 43 344 43 344 0V48Z" fill="url(#pl-side-${key})" stroke="#4b585b" stroke-width="1.5"/><ellipse cx="200" cy="48" rx="172" ry="34" fill="url(#pl-top-${key})" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/>${surfaces[key]||surfaces.earth}<ellipse cx="200" cy="49" rx="76" ry="13" fill="#000" opacity=".34"/><path d="M45 76c69 32 242 32 310 0" fill="none" stroke="currentColor" stroke-width="2" opacity=".2"/></svg><svg class="home-creature" viewBox="${b.slice(0,4).join(' ')}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${name}"><image href="assets/shinkaryu/${name.toLowerCase()}.png" width="${b[4]}" height="${b[5]}"/></svg></div>`;
}
const habitatStages=[['himori','magarok','kaguryon'],['mizuro','mizurai','mizuryon'],['komori','morika','daijurin'],['soripi','sorakaze','soraryu'],['bisonel','rocabison','terrabison'],['raikon','raidenko','raijuryu'],['yumori','yumbral','noctyron'],['yukiro','hyogara','hyokaiser']];
// Home scale is measured against the same stage and terrain, never the collection portrait.
const homeScale=[.4,.6,1];
// [support centre X, contact Y, silhouette scale], relative to the visible artwork window.
// Tail tips, wings and energy effects are not ground anchors. Collection assets are untouched.
const homePlacements={
 himori:[.58,.98,1],magarok:[.64,.98,1],kaguryon:[.70,.98,1],
 mizuro:[.65,.98,1],mizurai:[.49,.98,1],mizuryon:[.51,.98,1],
 komori:[.65,.98,1],morika:[.62,.98,1],daijurin:[.46,.98,.96],
 soripi:[.66,1,1],sorakaze:[.68,1,1],soraryu:[.67,1,.96],
 bisonel:[.53,.98,.96],rocabison:[.52,.98,.90],terrabison:[.52,.98,.78],
 raikon:[.60,.98,1],raidenko:[.59,.98,.96],raijuryu:[.67,.98,1],
 yumori:[.52,1,1],yumbral:[.52,1,1],noctyron:[.54,1,.96],
 yukiro:[.55,.98,1],hyogara:[.50,.98,.94],hyokaiser:[.48,.96,.92]
};
function illustratedHabitat(key,name,b){const stage=habitatStages.find(f=>f.includes(name.toLowerCase())).indexOf(name.toLowerCase());const [anchorX,anchorY,fit]=homePlacements[name.toLowerCase()];const shiftX=Number((b[2]*(.5-anchorX)).toFixed(2)),shiftY=Number((b[3]*(1-anchorY)).toFixed(2));const scale=homeScale[stage]*fit;const height=84*scale;const width=Math.min(100*scale,96/(2*Math.max(anchorX,1-anchorX)));const floating=key==='shadow'||key==='wind';return `<link rel="preload" as="image" href="assets/shinkaryu/${name.toLowerCase()}.png" fetchpriority="high"><div class="home-habitat illustrated-habitat ${floating?'is-hovering':''}" data-habitat="${key}" data-evolution="${stage+1}" style="--figure-width:${width}%;--figure-height:${height}%;--hover-height:${height}%"><img class="habitat-terrain" src="assets/habitats/${key}.png" alt="" aria-hidden="true" decoding="async" width="1774" height="887"><span class="habitat-contact" aria-hidden="true"></span><svg class="home-creature" viewBox="${b.slice(0,4).join(' ')}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${name}"><g transform="translate(${shiftX} ${shiftY})"><image href="assets/shinkaryu/${name.toLowerCase()}.png" width="${b[4]}" height="${b[5]}"/></g></svg></div>`;}
