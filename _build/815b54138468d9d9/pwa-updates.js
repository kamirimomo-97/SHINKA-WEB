export function setupPwaUpdates({environment,isBusy,notify=()=>{},host=globalThis.window,serviceWorker=globalThis.navigator?.serviceWorker}={}){
 if(!host?.addEventListener)return;
 if(!serviceWorker){host.addEventListener('shinka-request-update',()=>{if(isBusy())notify('Termina prima l’allenamento per ricaricare.');else host.location.reload();});return;}
 const build=globalThis.document?.getElementById?.('shinka-build-version')?.dataset.buildId||'development';
 serviceWorker.addEventListener('message',event=>{if(event.data?.type==='SHINKA_STATUS')event.ports?.[0]?.postMessage({busy:!!isBusy(),build});if(event.data?.type==='SHINKA_UPDATE_BLOCKED')notify('Aggiornamento in attesa: termina gli allenamenti aperti nelle altre schede.');});
 if(environment!=='beta'){host.addEventListener('shinka-request-update',()=>{if(isBusy())notify('Termina prima l’allenamento per ricaricare.');else host.location.reload();});void serviceWorker.getRegistrations().then(list=>Promise.all(list.filter(r=>r.active?.scriptURL?.endsWith('/sw.js')).map(r=>r.unregister()))).catch(()=>{});return;}
 let registration,controlled=!!serviceWorker.controller;
 serviceWorker.addEventListener('controllerchange',()=>{if(controlled&&!isBusy())host.location.reload();controlled=true;});
 host.addEventListener('shinka-request-update',async()=>{if(isBusy()){notify('Aggiornamento disponibile. Termina prima l’allenamento: i tuoi dati restano salvati.');return;}try{await registration?.update();if(registration?.waiting)registration.waiting.postMessage({type:'SHINKA_ACTIVATE'});else host.location.reload();}catch{notify('Connessione non disponibile. Puoi continuare a usare questa versione.');}});
 void serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{registration=r;const ready=()=>{if(r.waiting)notify('Nuova versione pronta. Tocca la versione in alto per aggiornare quando hai finito.');};ready();r.addEventListener('updatefound',()=>r.installing?.addEventListener('statechange',ready));host.addEventListener('online',()=>void r.update().catch(()=>{}));}).catch(()=>notify('Modalità offline non disponibile'));
}
