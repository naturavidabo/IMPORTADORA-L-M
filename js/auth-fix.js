/* L&M V1.3.2 · Corrección de confirmación por correo */
(()=>{
  const REDIRECT_URL='https://naturavidabo.github.io/IMPORTADORA-L-M/';
  const authDb=window.supabase.createClient(window.LM_CONFIG.SUPABASE_URL,window.LM_CONFIG.SUPABASE_PUBLISHABLE_KEY,{auth:{detectSessionInUrl:true,persistSession:true}});

  function showConfirmMessage(email){
    let root=document.getElementById('lm-auth-status');
    if(!root){root=document.createElement('div');root.id='lm-auth-status';document.body.appendChild(root)}
    root.innerHTML=`<div class="authStatusBack"><div class="authStatusCard"><div class="authStatusIcon">✓</div><div class="eyebrow">CUENTA CREADA</div><h2>Confirma tu correo</h2><p>Enviamos un enlace de confirmación a <b>${String(email||'tu correo').replace(/[<>]/g,'')}</b>.</p><p class="muted">Al tocar el enlace volverás directamente a L&M Importadora. Después podrás completar tu nombre y sucursal.</p><button class="btn primary block" onclick="document.getElementById('lm-auth-status')?.remove()">Entendido</button></div></div>`;
  }

  window.signUp=async function(){
    const email=document.getElementById('email')?.value?.trim();
    const password=document.getElementById('password')?.value||'';
    const p2=document.getElementById('password2')?.value||'';
    if(!email||!password||!p2)return window.toast?toast('Completa todos los campos','error'):alert('Completa todos los campos');
    if(password!==p2)return window.toast?toast('Las contraseñas no coinciden','error'):alert('Las contraseñas no coinciden');
    if(password.length<6)return window.toast?toast('La contraseña debe tener al menos 6 caracteres','error'):alert('La contraseña debe tener al menos 6 caracteres');
    const {data,error}=await authDb.auth.signUp({email,password,options:{emailRedirectTo:REDIRECT_URL}});
    if(error)return window.toast?toast(error.message,'error'):alert(error.message);
    localStorage.setItem('lm_pending_confirmation',email);
    if(data.session){localStorage.removeItem('lm_pending_confirmation');if(window.toast)toast('Cuenta creada correctamente');}
    else showConfirmMessage(email);
  };

  authDb.auth.onAuthStateChange((event,session)=>{
    if((event==='SIGNED_IN'||event==='INITIAL_SESSION')&&session){
      const pending=localStorage.getItem('lm_pending_confirmation');
      if(pending){localStorage.removeItem('lm_pending_confirmation');setTimeout(()=>{if(window.toast)toast('Correo confirmado. Bienvenido a L&M');},500)}
    }
  });

  const hash=new URLSearchParams(location.hash.replace(/^#/,''));
  if(hash.get('error_description'))setTimeout(()=>{if(window.toast)toast(decodeURIComponent(hash.get('error_description')),'error');},500);
})();