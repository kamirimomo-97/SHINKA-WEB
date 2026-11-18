import {eggArt} from './eggs.js';
import {creatureWindow} from './home-platform.js';

// One coordinate system and one terrain image through shell, flash and arrival.
export function hatchEnvironment(key,content){return `<div class="hatch-environment" data-element="${key}"><img class="hatch-sanctuary" src="assets/hatching/${key}.png" alt="" aria-hidden="true" width="1024" height="1536" decoding="async" fetchpriority="high"><span class="hatch-scene-shade" aria-hidden="true"></span><img class="hatch-terrain" src="assets/habitats/${key}.png" alt="" aria-hidden="true" width="1774" height="887" decoding="async"><span class="hatch-contact" aria-hidden="true"></span>${content}</div>`;}
export function hatchShell(key,taps){return `<span class="hatch-shell-position">${eggArt(key,taps)}</span>`;}
export function hatchCompanion(key,name){const b=creatureWindow(name);const picture=(cls,label)=>`<svg class="${cls}" viewBox="${b.slice(0,4).join(' ')}" preserveAspectRatio="xMidYMax meet" ${label?'role="img" aria-label="'+name+'"':'aria-hidden="true"'} focusable="false"><image href="assets/shinkaryu/${name.toLowerCase()}.png" width="${b[4]}" height="${b[5]}"/></svg>`;return `<span class="arrival-aura" aria-hidden="true"></span><span class="hatch-companion-position">${picture('arrival-color',true)}${picture('arrival-light',false)}</span><span class="arrival-veil" aria-hidden="true"></span>`;}
