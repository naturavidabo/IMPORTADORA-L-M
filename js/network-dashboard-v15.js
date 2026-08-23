/* L&M V1.5 · Panel consolidado de la Red */
(()=>{
const db=window.LM_DB||window.supabase.createClient(window.LM_CONFIG.SUPABASE_URL,window.LM_CONFIG.SUPABASE_PUBLISHABLE_KEY);
const escNet=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const moneyNet=n=>`Bs ${Number(n||0).toFixed(2)}`;
function productName(id){return (window.state?.products||[]).find(p=>p.id===id)?.name||'Producto'}
function branchName(id){return (window.state?.branches||[]).find(b=>b.id===id)?.name||'Sucursal'}

async function openNetworkDashboard(){
  const st=window.state;if(!st?.profile)return;
  const own=st.profile.branch_id;
  const [{data:inventory,error:iErr},{data:sharing},{data:requests}]=await Promise.all([
    db.from('inventory').select('*'),
    db.from('stock_sharing').select('*'),
    db.from('stock_requests').select('*').order('created_at',{ascending:false}).limit(80)
  ]);
  if(iErr)return alert(iErr.message);
  const rows=inventory||[], shares=sharing||[], req=requests||[];
  const visibleBranches=[...new Set(rows.map(r=>r.branch_id))];
  const totalUnits=rows.reduce((a,r)=>a+Number(r.stock||0),0);
  const products=[...new Set(rows.map(r=>r.product_id))];
  const pending=req.filter(r=>['pending','accepted'].includes(r.status)).length;
  const ownValue=rows.filter(r=>r.branch_id===own).reduce((a,r)=>a+Number(r.stock||0)*Number(r.price||0),0);

  const cities=visibleBranches.map(id=>{
    const rs=rows.filter(r=>r.branch_id===id),units=rs.reduce((a,r)=>a+Number(r.stock||0),0),active=rs.filter(r=>Number(r.stock||0)>0).length;
    return `<article class="lmCityCard"><h3>${escNet(branchName(id))}</h3><p>${units} unidades · ${active} productos con stock</p></article>`
  }).join('');

  const columns=visibleBranches.map(id=>`<th>${escNet(branchName(id))}</th>`).join('');
  const matrix=products.map(pid=>`<tr><td><b>${escNet(productName(pid))}</b></td>${visibleBranches.map(bid=>{const r=rows.find(x=>x.product_id===pid&&x.branch_id===bid);return `<td>${r?Number(r.stock||0):'—'}</td>`}).join('')}</tr>`).join('');

  let root=document.getElementById('lm-network-dashboard-root');if(!root){root=document.createElement('div');root.id='lm-network-dashboard-root';document.body.appendChild(root)}
  root.innerHTML=`<div class="modalback"><div class="modal lmNetworkDashboard"><div class="modalhead"><div><h3>Panel Red L&M</h3><small>Vista consolidada de los inventarios que tienes autorizados a consultar.</small></div><button class="close" onclick="closeNetworkDashboard()">×</button></div>
  <div class="lmNetSummary"><div class="lmNetKpi"><small>Sucursales visibles</small><b>${visibleBranches.length}</b></div><div class="lmNetKpi"><small>Unidades visibles</small><b>${totalUnits}</b></div><div class="lmNetKpi"><small>Productos distintos</small><b>${products.length}</b></div><div class="lmNetKpi"><small>Solicitudes activas</small><b>${pending}</b></div></div>
  <div class="sectionhead"><div><h2>Inventarios de la red</h2><small>Tu sucursal y las sucursales que decidieron compartir contigo.</small></div><button class="btn secondary" onclick="closeNetworkDashboard();openNetworkLM()">Permisos y solicitudes</button></div>
  <div class="lmCityGrid">${cities||'<div class="empty">No tienes otros inventarios visibles todavía.</div>'}</div>
  <div class="sectionhead"><div><h2>Matriz de stock</h2><small>El mismo producto comparado entre ciudades.</small></div></div>
  <div class="lmStockMatrix"><table><thead><tr><th>Producto</th>${columns}</tr></thead><tbody>${matrix||'<tr><td colspan="5">Sin datos de inventario.</td></tr>'}</tbody></table></div>
  <div class="notice" style="margin-top:14px">Valor de venta estimado de tu stock actual: <b>${moneyNet(ownValue)}</b>. Los inventarios ajenos solo aparecen cuando su propietario habilita la visibilidad.</div></div></div>`;
}
function closeNetworkDashboard(){document.getElementById('lm-network-dashboard-root')?.remove()}

function injectPanelEntry(){
 const panel=document.querySelector('.netPanel');if(panel&&!panel.querySelector('.lmOpenNetDashboard')){
   const head=panel.querySelector('.modalhead');if(head){const b=document.createElement('button');b.className='btn primary lmOpenNetDashboard';b.textContent='Panel general';b.onclick=()=>{document.getElementById('network-root')?.remove();openNetworkDashboard()};head.insertBefore(b,head.querySelector('.close'))}
 }
 const quick=document.getElementById('lmQuickWrap');if(quick&&!quick.querySelector('.lmNetDashboardQuick')){
   const grid=quick.querySelector('.lmQuickGrid');if(grid){const b=document.createElement('button');b.className='lmQuickAction lmNetDashboardQuick';b.onclick=openNetworkDashboard;b.innerHTML='<span class="lmQuickIcon"><svg viewBox="0 0 24 24"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg></span><b>Panel Red</b><small>Todos los stocks visibles</small>';grid.appendChild(b)}
 }
}
new MutationObserver(()=>requestAnimationFrame(injectPanelEntry)).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(injectPanelEntry,800);
Object.assign(window,{openNetworkDashboard,closeNetworkDashboard});
})();