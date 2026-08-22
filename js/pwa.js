/* L&M Importadora · Instalación PWA */
(()=>{
  let deferredPrompt=null;
  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function ensureInstallButton(){
    if(isStandalone()||document.getElementById('lm-install-app'))return;
    const btn=document.createElement('button');
    btn.id='lm-install-app';
    btn.type='button';
    btn.textContent='Instalar L&M';
    btn.setAttribute('aria-label','Instalar L&M Importadora');
    Object.assign(btn.style,{position:'fixed',right:'14px',bottom:'84px',zIndex:'80',border:'1px solid #6d5523',borderRadius:'14px',padding:'11px 15px',fontWeight:'900',background:'linear-gradient(145deg,#ecd47f,#b88935)',color:'#09090b',boxShadow:'0 12px 35px rgba(0,0,0,.45)',display:'none'});
    btn.addEventListener('click',async()=>{
      if(!deferredPrompt){
        alert('La instalación todavía no está disponible. Actualiza la página una vez y vuelve a intentar.');
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null;
      btn.style.display='none';
    });
    document.body.appendChild(btn);
  }

  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(err=>console.error('SW L&M:',err)));
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    ensureInstallButton();
    const btn=document.getElementById('lm-install-app');
    if(btn)btn.style.display='block';
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    const btn=document.getElementById('lm-install-app');
    if(btn)btn.remove();
  });

  document.addEventListener('DOMContentLoaded',ensureInstallButton);
})();