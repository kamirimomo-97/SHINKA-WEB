// One coordinate system for the complete badge, its sockets and its crystals.
// Never maintain an independent CSS position or mobile offset for a crystal.
export const STEEL_VIEWBOX='0 0 1200 240';
export const SLOT_PATH='M0 -85 19 -49 10 -27 0 -14 -10 -27 -19 -49Z';
export const BEZEL_PATH='M0 -105 32 -51 20 -20 0 -5 -20 -20 -32 -51Z';
export const SLOT_ANGLES=Object.freeze([0,72,144,216,288]);
export function gemCount(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(5,Math.floor(n))):0;}
const escapeText=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function steelBadge({count=0,name='Allenatore',level=0,fresh=-1,id='steel',detail=false}={}){
 const n=gemCount(count),prefix=id.replace(/[^a-zA-Z0-9_-]/g,'')||'steel',ref=key=>`url(#${prefix}-${key})`;
 const sockets=SLOT_ANGLES.map((angle,i)=>`<g transform="rotate(${angle})" data-socket="${i+1}">
 <path d="${BEZEL_PATH}" fill="${ref('metal')}" stroke="#10121c" stroke-width="2"/>
 <path d="M0 -105 -32 -51 -20 -20 0 -5 -10 -27 -19 -49Z" fill="#c1c8dc" opacity=".65"/>
 <path d="M0 -105 32 -51 20 -20 0 -5 10 -27 19 -49Z" fill="#343c54"/>
 <path d="${SLOT_PATH}" fill="#0d101b" stroke="#77829d" stroke-width="1.6"/>
 <path d="M0 -85 -19 -49 -10 -27 0 -14" fill="none" stroke="#05060c" stroke-width="3"/>
 <path d="M0 -85 19 -49 10 -27 0 -14" fill="none" stroke="#d2d9eb" stroke-opacity=".5" stroke-width="1"/>
 <g class="steel-crystal ${i<n?'filled':''} ${i===fresh&&i<n?'newly-set':''}" data-slot="${i+1}" clip-path="${ref('socket')}" ${i<n?'':'visibility="hidden"'}>
 <path d="${SLOT_PATH}" fill="${ref('crystal')}"/>
 <path d="M0 -85 -19 -49 0 -42Z" fill="#f7e5ff"/>
 <path d="M0 -85 19 -49 0 -42Z" fill="#ca8bff"/>
 <path d="M-19 -49 0 -42 0 -14 -10 -27Z" fill="#a763e5"/>
 <path d="M19 -49 0 -42 0 -14 10 -27Z" fill="#602ba0"/>
 <path d="M0 -85V-14M-19 -49 0 -42 19 -49" fill="none" stroke="#fff0ff" stroke-width="1.2" stroke-opacity=".8"/>
 <path d="${SLOT_PATH}" fill="none" stroke="#f6cfff" stroke-width="2"/>
 </g></g>`).join('');
 return `<svg class="steel-badge ${detail?'crest-detail':''}" xmlns="http://www.w3.org/2000/svg" viewBox="${detail?'970 0 230 240':STEEL_VIEWBOX}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Targhetta Acciaio, ${n} gemme su 5" data-filled="${n}">
 <defs>
 <linearGradient id="${prefix}-metal" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#fff"/><stop offset=".16" stop-color="#77829c"/><stop offset=".32" stop-color="#e1e6f3"/><stop offset=".48" stop-color="#3a435c"/><stop offset=".68" stop-color="#b3bdd4"/><stop offset=".84" stop-color="#f3f5ff"/><stop offset="1" stop-color="#555d77"/></linearGradient>
 <linearGradient id="${prefix}-edge"><stop stop-color="#434c66"/><stop offset=".28" stop-color="#f0f4ff"/><stop offset=".5" stop-color="#5f6b85"/><stop offset=".74" stop-color="#b4bed2"/><stop offset="1" stop-color="#eff2ff"/></linearGradient>
 <linearGradient id="${prefix}-plate" x2="1" y2="1"><stop stop-color="#171a2a"/><stop offset=".5" stop-color="#252434"/><stop offset="1" stop-color="#080e19"/></linearGradient>
 <linearGradient id="${prefix}-crystal" x2=".6" y2="1"><stop stop-color="#fff4ff"/><stop offset=".4" stop-color="#d5a1ff"/><stop offset="1" stop-color="#6437ad"/></linearGradient>
 <radialGradient id="${prefix}-hub"><stop stop-color="#bbc6de"/><stop offset=".45" stop-color="#57627b"/><stop offset=".78" stop-color="#11182a"/><stop offset="1" stop-color="#b1bad0"/></radialGradient>
 <clipPath id="${prefix}-socket"><path d="${SLOT_PATH}"/></clipPath>
 <clipPath id="${prefix}-portrait"><path d="M83 45H157L199 120 157 195H83L41 120Z"/></clipPath>
 <pattern id="${prefix}-brush" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(34)"><path d="M0 0V11M4 0V11" stroke="#c8d4ee" stroke-width=".5" opacity=".08"/></pattern>
 </defs>
 <g class="badge-body">
 <path d="M156 47H1023L1135 120 1023 193H156L108 120Z" fill="${ref('edge')}" stroke="#080c17" stroke-width="3"/>
 <path d="M163 54H1020L1122 120 1020 186H163L123 120Z" fill="${ref('metal')}"/>
 <path d="M170 65H1015L1097 120 1015 175H170L140 120Z" fill="${ref('plate')}" stroke="#060b15" stroke-width="3"/>
 <path d="M170 65H1015L1097 120 1015 175H170L140 120Z" fill="${ref('brush')}"/>
 <path d="M206 69H780L803 56H982L1035 84M206 172H698L718 184H1000L1045 158" fill="none" stroke="#eef1ff" stroke-opacity=".5" stroke-width="2"/>
 <path d="M198 47H350L328 62H214ZM714 47H839L820 62H697ZM1013 47 1053 73 1026 77 990 55Z" fill="${ref('edge')}" stroke="#333b53"/>
 <path d="M198 193H305L329 177H214ZM672 193H809L828 177H689ZM1013 193 1053 167 1026 163 990 185Z" fill="${ref('edge')}" stroke="#333b53"/>
 <path d="m612 74 62 0-33 30-62 0ZM815 145H875L844 170H784Z" fill="#66708a" opacity=".13"/>
 <path d="m623 75-31 28M636 75l-31 28M649 75l-31 28M662 75l-31 28" stroke="#b5bfd5" opacity=".15"/>
 <path d="M82 25H158L214 120 158 215H82L26 120Z" fill="${ref('edge')}" stroke="#080b15" stroke-width="3"/>
 <path d="M85 35H155L204 120 155 205H85L36 120Z" fill="${ref('metal')}"/>
 <path d="M83 45H157L199 120 157 195H83L41 120Z" fill="#1b1529" stroke="#0c111d" stroke-width="3"/>
 <g clip-path="${ref('portrait')}"><svg x="43" y="36" width="155" height="170" viewBox="0 0 100 110"><image href="assets/avatar-gallery/01-neutral.webp" width="100" height="440" preserveAspectRatio="xMidYMin slice"/></svg><path d="M42 169H199V200H42Z" fill="#171522" opacity=".24"/></g>
 <path d="M83 45H157L199 120 157 195H83L41 120Z" fill="none" stroke="#dce1f2" stroke-width="1.8"/>
 <path d="M81 25 65 53 76 51 88 32M159 215l16-28-11 2-12 19" fill="#fff" opacity=".8"/>
 <text x="245" y="112" fill="#f3eef8" font-family="Georgia,serif" font-size="39" font-weight="600" letter-spacing="1">${escapeText(String(name).slice(0,22))}</text>
 <text x="247" y="149" fill="#bbc3d7" font-family="Georgia,serif" font-size="23">Livello ${Math.max(0,Math.floor(Number(level)||0))}</text>
 <path d="M247 162H437" stroke="#8893ac" stroke-opacity=".45"/>
 <circle cx="941" cy="59" r="3" fill="#263047" stroke="#a5b1ce"/><circle cx="941" cy="181" r="3" fill="#263047" stroke="#a5b1ce"/>
 </g>
 <g class="steel-crest" transform="translate(1081 120)">
 <path d="M0 -106 28 -38 101 -33 45 14 63 86 0 46 -63 86 -45 14 -101 -33 -28 -38Z" fill="#202737" stroke="#9ca7bf" stroke-width="2"/>
 ${sockets}
 <circle r="11" fill="${ref('hub')}" stroke="#070b13" stroke-width="2"/>
 <circle r="3.5" fill="#ccd4e4" opacity=".6"/>
 </g></svg>`;
}
