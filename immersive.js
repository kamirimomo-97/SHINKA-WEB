export const seal='<img class="shinka-seal" src="assets/brand/seal.svg" alt="" aria-hidden="true">';
const paths={home:'<path d="m3 11 9-8 9 8v10h-7v-7h-4v7H3Z"/>',plans:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 3h6v4H9Zm0 8h6m-6 5h6"/>',progress:'<path d="M4 20V12m8 8V7m8 13V3M2 22h20"/>',arena:'<path d="m4 3 17 18m-1-18L3 21M3 3l5 1-4 4ZM21 3l-5 1 4 4ZM2 17l5 5m10 0 5-5"/>',profile:'<path d="m12 2 8 5v10l-8 5-8-5V7Z"/><path d="m12 6 4 6-4 6-4-6Z"/>'};
export function navigation(page){return [['home','Home'],['plans','Schede'],['progress','Progressi'],['arena','Arena'],['profile','Shinkaryu']].map(([id,label])=>`<a href="#${id}" aria-label="${label}" class="${page===id?'active':''}" ${page===id?'aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${paths[id]}</svg><span>${label}</span></a>`).join('');}
export function applyImmersive(page,onboarding=false){if(typeof document.body?.setAttribute!=='function')return;document.body.dataset.page=page;const badge=document.querySelector('header .badge');if(badge)badge.textContent=new URLSearchParams(location.search||'').has('demo')||new URLSearchParams(location.search||'').has('primo-accesso')?'DEMO':'LAB';document.body.classList.toggle('is-onboarding',onboarding);}
export function launchScreen(){if(typeof document.createElement!=='function'||!document.body)return;const splash=document.createElement('div');splash.className='shinka-launch';splash.setAttribute('aria-hidden','true');splash.innerHTML='<img class="official-launch-logo" src="assets/brand/official-app-icon.png" alt=""><b>SHINKA</b><p>La tua forza.<br>La vostra evoluzione.</p><span></span>';document.body.append(splash);const dismiss=()=>splash.remove();splash.addEventListener('click',dismiss,{once:true});setTimeout(dismiss,1250);}

// Keep the dock and its links mounted while content and active state change.
export function updateNavigation(nav,page){
 const links=nav.querySelectorAll?.('a')||[];
 if(links.length!==5){nav.innerHTML=navigation(page);return;}
 for(const link of links){const active=link.getAttribute('href')==='#'+page;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
}
