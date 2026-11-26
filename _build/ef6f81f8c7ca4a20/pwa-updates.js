// The first document may finish loading its images before the worker controls it.
// Preserve only assets actually opened in that document, reusing HTTP cache where possible.
export async function cacheOpenedAssets({build,baseURI,urls,cacheStorage=globalThis.caches,fetcher=globalThis.fetch}){
 if(!build||build==='development'||!cacheStorage)return;
 const root=new URL('./',baseURI),assets=[...new Set(urls.filter(Boolean).map(value=>new URL(value,root).href))].filter(value=>{const url=new URL(value);return url.origin===root.origin&&url.pathname.startsWith(root.pathname+'assets/');});
 const cache=await cacheStorage.open('shinka-beta-build-'+build);let position=0;
 const copy=async()=>{while(position<assets.length){const url=assets[position++];if(await cache.match(url))continue;const response=await fetcher(url,{cache:'force-cache'});if(!response.ok||response.type==='opaque')throw Error('Offline asset unavailable');await cache.put(url,response);}};
 await Promise.all([copy(),copy()]);return assets.length;
}
export function setupPwaUpdates({environment,isBusy,notify=()=>{},host=globalThis.window,serviceWorker=globalThis.navigator?.serviceWorker}={}){
 if(!host?.addEventListener)return;
 if(!serviceWorker){host.addEventListener('shinka-request-update',()=>{if(isBusy())notify('Termina prima l’allenamento per ricaricare.');else host.location.reload();});return;}
 const build=globalThis.document?.getElementById?.('shinka-build-version')?.dataset.buildId||'development';
 serviceWorker.addEventListener('message',event=>{if(event.data?.type==='SHINKA_STATUS')event.ports?.[0]?.postMessage({busy:!!isBusy(),build});if(event.data?.type==='SHINKA_UPDATE_BLOCKED')notify('Aggiornamento in attesa: termina gli allenamenti aperti nelle altre schede.');});
 if(environment!=='beta'){host.addEventListener('shinka-request-update',()=>{if(isBusy())notify('Termina prima l’allenamento per ricaricare.');else host.location.reload();});void serviceWorker.getRegistrations().then(list=>Promise.all(list.filter(r=>r.active?.scriptURL?.endsWith('/sw.js')).map(r=>r.unregister()))).catch(()=>{});return;}
 let registration,controlled=!!serviceWorker.controller,warming=false,prepared=false;
 const prepareOpenedView=async()=>{const doc=globalThis.document;if(prepared||warming||!serviceWorker.controller||doc?.readyState!=='complete')return;warming=true;try{const urls=[...(globalThis.performance?.getEntriesByType?.('resource')||[]).map(entry=>entry.name),...Array.from(doc.querySelectorAll('img,svg image'),node=>node.currentSrc||node.getAttribute('src')||node.getAttribute('href'))];await cacheOpenedAssets({build,baseURI:doc.baseURI,urls});prepared=true;notify('SHINKA pronta per l’uso offline su questo dispositivo.');}catch{notify('Preparazione offline incompleta. Mantieni la connessione e riprova.');}finally{warming=false;}};
 host.addEventListener('load',()=>void prepareOpenedView());
 host.addEventListener('online',()=>void prepareOpenedView());
 void serviceWorker.ready?.then(()=>prepareOpenedView()).catch(()=>{});
 serviceWorker.addEventListener('controllerchange',()=>{if(controlled&&!isBusy())host.location.reload();else void prepareOpenedView();controlled=true;});
 host.addEventListener('shinka-request-update',async()=>{if(isBusy()){notify('Aggiornamento disponibile. Termina prima l’allenamento: i tuoi dati restano salvati.');return;}try{await registration?.update();if(registration?.waiting)registration.waiting.postMessage({type:'SHINKA_ACTIVATE'});else host.location.reload();}catch{notify('Connessione non disponibile. Puoi continuare a usare questa versione.');}});
 void serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{registration=r;const ready=()=>{if(controlled&&r.waiting)notify('Nuova versione pronta. Tocca la versione in alto per aggiornare quando hai finito.');};ready();r.addEventListener('updatefound',()=>r.installing?.addEventListener('statechange',ready));host.addEventListener('online',()=>void r.update().catch(()=>{}));}).catch(()=>notify('Modalità offline non disponibile'));
}
