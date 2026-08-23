/* L&M V1.5 · Sesión persistente y cliente Supabase único */
(()=>{
  const cfg=window.LM_CONFIG||{};
  if(!window.supabase||!cfg.SUPABASE_URL||!cfg.SUPABASE_PUBLISHABLE_KEY)return;
  const originalCreate=window.supabase.createClient.bind(window.supabase);
  const authOptions={
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:true,
    storage:window.localStorage,
    storageKey:'lm-importadora-auth-v15'
  };
  const shared=originalCreate(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY,{auth:authOptions});
  window.LM_DB=shared;
  window.supabase.createClient=(url,key,options={})=>{
    if(url===cfg.SUPABASE_URL&&key===cfg.SUPABASE_PUBLISHABLE_KEY)return shared;
    return originalCreate(url,key,options);
  };

  let refreshing=false;
  async function keepSessionAlive(){
    if(refreshing)return;
    refreshing=true;
    try{
      const {data,error}=await shared.auth.getSession();
      if(error)return;
      const session=data?.session;
      if(!session)return;
      const expires=(session.expires_at||0)*1000;
      if(!expires||expires-Date.now()<8*60*1000){
        await shared.auth.refreshSession();
      }
    }catch(e){
      console.warn('L&M session keepalive',e);
    }finally{refreshing=false}
  }

  window.addEventListener('focus',keepSessionAlive);
  window.addEventListener('pageshow',keepSessionAlive);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')keepSessionAlive()});
  setInterval(keepSessionAlive,4*60*1000);

  shared.auth.onAuthStateChange((event,session)=>{
    if(session){
      localStorage.setItem('lm_session_present','1');
      localStorage.setItem('lm_last_session_event',event||'SESSION');
    }else if(event==='SIGNED_OUT'){
      localStorage.removeItem('lm_session_present');
    }
  });
})();