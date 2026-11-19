import {trainerBadge} from './trainer-badge.js?v=0.60.4';
import {galleryArt,setupGallery} from './avatar-gallery.js?v=0.60.4';
import {hydrateAvatars} from './avatar-appearance.js?v=0.60.4';
import {avatarModels,avatarParts,avatarPresets,avatarColorPalettes,hairStyles,normalizeAvatar,currentPreset,avatarAsset,garmentFile} from './avatar-catalog.js?v=0.60.4';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const emptyImage='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const categories={torso:'Busto',legs:'Gambe',feet:'Piedi'};

export function avatarArt(avatar,view='full') {
  if(avatar?.gallery||!avatar)return galleryArt(avatar?.gallery,view);
  const choice=normalizeAvatar(avatar);
  const label=`Personaggio ${avatarModels[choice.model].toLowerCase()}, ${hairStyles(choice.model)[choice.hairStyle]}, capelli ${avatarColorPalettes.hair[choice.hair].name.toLowerCase()}, pelle ${avatarColorPalettes.skin[choice.skin].name.toLowerCase()}, occhi ${avatarColorPalettes.eyes[choice.eyes].name.toLowerCase()}`;
  return `<span class="player-avatar-art" role="img" aria-label="${escapeHtml(label)}"><img src="${emptyImage}" data-avatar-choice="${escapeHtml(JSON.stringify(choice))}" data-avatar-view="${view}" alt="" aria-hidden="true" width="${view==='head'?300:512}" height="${view==='head'?310:1120}"></span>`;
}

export function avatarProfile(db,level){return trainerBadge(db,level,avatarArt(db.avatar,'head'));}

function colorChoices(avatar,field,label) {
  const colors=avatarColorPalettes[field];
  return `<fieldset class="appearance-colors"><legend>${label} <strong>${colors[avatar[field]].name}</strong></legend><div class="appearance-swatches" style="--choices:${Object.keys(colors).length}">${Object.entries(colors).map(([key,color])=>`<button data-act="wardrobe-color" data-field="${field}" data-value="${key}" aria-label="${label} ${color.name}" aria-pressed="${avatar[field]===key}" title="${color.name}"><span style="background:${color.color}">${avatar[field]===key?'✓':''}</span></button>`).join('')}</div></fieldset>`;
}

export function wardrobeView(raw,tab='appearance',category='torso',zoom=null) {
  const avatar=normalizeAvatar(raw),view=zoom||(tab==='outfit'?'full':'head');
  const preset=currentPreset(avatar);
  return `<div id="wardrobe-content" class="wardrobe">
    <div class="wardrobe-heading"><small>IL TUO STILE, PEZZO PER PEZZO</small><h2>Il tuo personaggio</h2></div>
    <div class="wardrobe-tabs" role="group" aria-label="Personalizzazione">${[['appearance','Aspetto'],['hair','Capelli'],['outfit','Abiti']].map(([key,name])=>`<button data-act="wardrobe-tab" data-tab="${key}" aria-pressed="${tab===key}">${name}</button>`).join('')}</div>
    <div class="wardrobe-workspace">
      <div class="wardrobe-preview"><div class="avatar-preview-figure ${view==='head'?'is-head':''}">${avatarArt(avatar,view)}</div><button class="wardrobe-zoom quiet" data-act="wardrobe-zoom" aria-label="${view==='head'?'Mostra figura intera':'Mostra viso'}">${view==='head'?'↙ Figura intera':'↗ Viso'}</button><span class="wardrobe-preview-label">${avatarModels[avatar.model]} · ${preset?avatarPresets[preset].name:'Look personale'}</span></div>
      <div class="wardrobe-controls">
      ${tab==='appearance'?`
        <fieldset class="wardrobe-models"><legend>Modello</legend><div>${Object.entries(avatarModels).map(([key,name])=>`<button data-act="wardrobe-model" data-model="${key}" aria-pressed="${avatar.model===key}">${name}</button>`).join('')}</div></fieldset>
        ${colorChoices(avatar,'skin','Pelle')}${colorChoices(avatar,'eyes','Occhi')}
        `:''}
      ${tab==='hair'?`
        <fieldset class="wardrobe-items wardrobe-hairstyles"><legend>Taglio</legend><div>${Object.entries(hairStyles(avatar.model)).map(([key,name])=>`<button data-act="wardrobe-hairstyle" data-style="${key}" aria-pressed="${avatar.hairStyle===key}" aria-label="Taglio ${name}"><img src="${avatarAsset(avatar.model,'raw/head-'+key)}" alt="" loading="eager"><strong>${name}</strong></button>`).join('')}</div></fieldset>
        ${colorChoices(avatar,'hair','Capelli')}`:''}
      ${tab==='outfit'?`
        <fieldset class="wardrobe-presets"><legend>Parti da un completo</legend><div>${Object.entries(avatarPresets).map(([key,item])=>`<button data-act="wardrobe-outfit" data-outfit="${key}" aria-pressed="${preset===key}">${item.name}</button>`).join('')}</div></fieldset>
        <div class="wardrobe-categories" role="group" aria-label="Categoria indumenti">${Object.entries(categories).map(([key,name])=>`<button data-act="wardrobe-category" data-category="${key}" aria-pressed="${category===key}">${name}</button>`).join('')}</div>
        <fieldset class="wardrobe-items"><legend>${categories[category]}</legend><div>${Object.entries(avatarParts[category]).map(([key,name])=>`<button data-act="wardrobe-part" data-slot="${category}" data-item="${key}" aria-pressed="${avatar.modules[category]===key}" aria-label="${escapeHtml(name)}"><img src="${avatarAsset(avatar.model,'raw/'+garmentFile(category,key))}" alt="" loading="eager"><strong>${name}</strong></button>`).join('')}</div></fieldset>
        `:''}
      </div>
    </div>
    <div class="wardrobe-footer"><p id="wardrobe-status" class="wardrobe-status" role="status">Preparazione anteprima…</p><div class="wardrobe-actions"><button class="quiet" data-act="wardrobe-cancel">Annulla</button><button class="primary" data-act="wardrobe-save" disabled>Salva personaggio</button></div></div>
  </div>`;
}

export function setupWardrobe(api) { return setupGallery(api); }

export function setupLegacyWardrobe(api) {
  let pending=null,tab='appearance',category='torso',zoom=null;
  const refresh=()=>{
    const controls=document.querySelector('.wardrobe-controls'),scroll=controls?.scrollTop||0;
    document.querySelector('#wardrobe-content').outerHTML=wardrobeView(pending,tab,category,zoom);
    const updated=document.querySelector('.wardrobe-controls');if(updated)updated.scrollTop=scroll;
    hydrateAvatars(document.querySelector('#modal'));
  };
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-act]');if(!button)return;
    const {act:action}=button.dataset;
    if(action==='wardrobe-open') {
      pending=normalizeAvatar(api.db().avatar);tab='appearance';category='torso';zoom=null;
      api.modal(wardrobeView(pending,tab,category,zoom));hydrateAvatars(document.querySelector('#modal'));return;
    }
    if(action==='wardrobe-cancel'||action==='close-modal') {
      pending=null;
      if(action==='wardrobe-cancel')document.querySelector('#modal').close();
      return;
    }
    if(!pending)return;
    if(action==='wardrobe-save') {
      if(button.disabled)return;
      const db=api.db(),previous=db.avatar;db.avatar=normalizeAvatar(pending);
      if(!api.save()) {if(previous===undefined)delete db.avatar;else db.avatar=previous;return;}
      pending=null;document.querySelector('#modal').close();api.render();api.toast('Il tuo personaggio è salvato');return;
    }
    if(action==='wardrobe-tab') {
      if(!['appearance','hair','outfit'].includes(button.dataset.tab))return;
      tab=button.dataset.tab;zoom=null;
    } else if(action==='wardrobe-model') {
      if(!Object.hasOwn(avatarModels,button.dataset.model))return;
      pending.model=button.dataset.model;
    } else if(action==='wardrobe-color') {
      const {field,value}=button.dataset;
      if(!Object.hasOwn(avatarColorPalettes,field)||!Object.hasOwn(avatarColorPalettes[field],value))return;
      pending[field]=value;
    } else if(action==='wardrobe-hairstyle') {
      if(!Object.hasOwn(hairStyles(pending.model),button.dataset.style))return;
      pending.hairStyle=button.dataset.style;
    } else if(action==='wardrobe-outfit') {
      const key=button.dataset.outfit;if(!Object.hasOwn(avatarPresets,key))return;
      pending.modules={...avatarPresets[key].modules};if(key!=='base')pending.outfit=key;
    } else if(action==='wardrobe-category') {
      if(!Object.hasOwn(categories,button.dataset.category))return;
      category=button.dataset.category;
    } else if(action==='wardrobe-part') {
      const {slot,item}=button.dataset;if(!Object.hasOwn(avatarParts,slot)||!Object.hasOwn(avatarParts[slot],item))return;
      pending.modules[slot]=item;
    } else if(action==='wardrobe-zoom') {
      zoom=(zoom||(tab==='outfit'?'full':'head'))==='full'?'head':'full';
    } else return;
    const data={...button.dataset};refresh();
    // Keep keyboard focus on the selected control after replacing its panel.
    const selector=Object.entries(data).map(([key,value])=>`[data-${key}="${value}"]`).join('');
    document.querySelector(selector)?.focus({preventScroll:true});
  });
}
