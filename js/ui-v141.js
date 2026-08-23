/* L&M Importadora V1.4.1 · Pulido de experiencia e iconografía */
(()=>{
const icons={
 home:'<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/></svg>',
 box:'<svg viewBox="0 0 24 24"><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></svg>',
 cart:'<svg viewBox="0 0 24 24"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="10" cy="19" r="1.4"/><circle cx="18" cy="19" r="1.4"/></svg>',
 import:'<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M5 18v2h14v-2"/></svg>',
 catalog:'<svg viewBox="0 0 24 24"><path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5Z"/><path d="M8 20a3 3 0 0 1 0-6h11"/><path d="M9 8h6"/></svg>',
 settings:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7a7.4 7.4 0 0 0-.7-1.7l.9-1.9-2.1-2.1-1.9.9a7.4 7.4 0 0 0-1.7-.7L10.5 2h-3l-.7 2a7.4 7.4 0 0 0-1.7.7l-1.9-.9-2.1 2.1.9 1.9a7.4 7.4 0 0 0-.7 1.7L0 10.5v3l2 .7c.2.6.4 1.2.7 1.7l-.9 1.9 2.1 2.1 1.9-.9c.5.3 1.1.5 1.7.7l.7 2h3l.7-2c.6-.2 1.2-.4 1.7-.7l1.9.9 2.1-2.1-.9-1.9c.3-.5.5-1.1.7-1.7l2-.7Z" transform="translate(2 0) scale(.83)"/></svg>',
 network:'<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.5"/><circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="m10.7 8.2-3.3 6.3M13.3 8.2l3.3 6.3M8.5 17h7"/></svg>',
 plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
};
const navMap={Inicio:'home',Inventario:'box',Ventas:'cart',Importaciones:'import','Catálogo':'catalog',Ajustes:'settings'};
const iconWrap=name=>`<span class="lmQuickIcon">${icons[name]}</span>`;

function decorateNav(){
 document.querySelectorAll('nav button').forEach(btn=>{
   if(btn.dataset.lmIcon==='1')return;
   const label=btn.querySelector('span')?.textContent?.trim();
   if(!label||!navMap[label])return;
   btn.innerHTML=`<span class="lmNavIcon">${icons[navMap[label]]}</span><span>${label}</span>`;
   btn.dataset.lmIcon='1';
   btn.setAttribute('aria-label',label);
 });
 const net=document.getElementById('lmNetworkBtn');
 if(net&&!net.dataset.lmIcon){net.innerHTML=`<span class="lmNavIcon">${icons.network}</span><span>Red L&M</span>`;net.dataset.lmIcon='1'}
}

function quickCard(action,icon,title,sub){return `<button class="lmQuickAction" onclick="lmQuick('${action}')">${iconWrap(icon)}<b>${title}</b><small>${sub}</small></button>`}
function injectQuickActions(){
 const content=document.getElementById('content');if(!content)return;
 const title=content.querySelector('.hero h1')?.textContent?.trim()||'';
 if(!title.startsWith('Hola,')){document.getElementById('lmQuickWrap')?.remove();return}
 if(document.getElementById('lmQuickWrap'))return;
 const hero=content.querySelector('.hero');if(!hero)return;
 const wrap=document.createElement('section');wrap.id='lmQuickWrap';wrap.className='lmQuickWrap';
 wrap.innerHTML=`<div class="lmQuickTitle"><strong>Accesos rápidos</strong><small>Todo lo importante a un toque</small></div><div class="lmQuickGrid">${quickCard('sale','cart','Nueva venta','Registrar una venta ahora')}${quickCard('product','plus','Nuevo producto','Agregar al inventario')}${quickCard('import','import','Importación','Registrar nueva llegada')}${quickCard('catalog','catalog','Catálogo PDF','Preparar catálogo comercial')}${quickCard('network','network','Red L&M','Stocks y solicitudes')}</div>`;
 hero.insertAdjacentElement('afterend',wrap);
}

function enhanceSales(){
 const content=document.getElementById('content');if(!content)return;
 const title=content.querySelector('.hero h1')?.textContent?.trim()||'';
 if(title!=='Nueva venta')return;
 const grid=content.querySelector('.grid2');if(grid){grid.classList.add('sales-layout');const cart=grid.querySelector('aside.card');if(cart)cart.classList.add('sale-cart')}
 if(!content.querySelector('.lmSaleSteps')){
   const hero=content.querySelector('.hero');if(hero){const steps=document.createElement('div');steps.className='lmSaleSteps';steps.innerHTML='<span class="lmSaleStep"><i>1</i>Elegir productos</span><span class="lmSaleStep"><i>2</i>Revisar carrito</span><span class="lmSaleStep"><i>3</i>Cliente y pago</span><span class="lmSaleStep"><i>4</i>Confirmar</span>';hero.insertAdjacentElement('afterend',steps)}
 }
}

function ensureFab(){
 const hasNav=!!document.querySelector('nav');
 const auth=!!document.querySelector('.authWrap');
 let fab=document.getElementById('lmFab');
 if(!hasNav||auth){fab?.remove();document.getElementById('lmActionSheetBack')?.remove();return}
 if(fab)return;
 fab=document.createElement('button');fab.id='lmFab';fab.className='lmFab';fab.type='button';fab.setAttribute('aria-label','Acciones rápidas');fab.textContent='+';fab.onclick=toggleLmActions;document.body.appendChild(fab);
}

function toggleLmActions(){
 const old=document.getElementById('lmActionSheetBack');if(old){old.remove();return}
 const back=document.createElement('div');back.id='lmActionSheetBack';back.className='lmActionSheetBack';back.onclick=e=>{if(e.target===back)back.remove()};
 const btn=(a,i,t,s)=>`<button class="lmSheetBtn" onclick="lmQuick('${a}');document.getElementById('lmActionSheetBack')?.remove()">${iconWrap(i)}<span><b>${t}</b><small>${s}</small></span></button>`;
 back.innerHTML=`<div class="lmActionSheet"><div class="lmSheetHandle"></div><h3>¿Qué quieres hacer?</h3><div class="lmSheetGrid">${btn('sale','cart','Nueva venta','Abrir punto de venta')}${btn('product','plus','Nuevo producto','Crear ficha y stock')}${btn('import','import','Importación','Registrar mercadería')}${btn('catalog','catalog','Catálogo PDF','Seleccionar y generar')}${btn('inventory','box','Inventario','Consultar existencias')}${btn('network','network','Red L&M','Compartir y solicitar')}</div></div>`;
 document.body.appendChild(back);
}

function lmQuick(action){
 try{
  if(action==='sale'&&typeof window.go==='function')return window.go('Ventas');
  if(action==='product'){if(typeof window.go==='function')window.go('Inventario');setTimeout(()=>typeof window.openProduct==='function'&&window.openProduct(),80);return}
  if(action==='import'&&typeof window.go==='function')return window.go('Importaciones');
  if(action==='catalog'&&typeof window.go==='function')return window.go('Catálogo');
  if(action==='inventory'&&typeof window.go==='function')return window.go('Inventario');
  if(action==='network'&&typeof window.openNetworkLM==='function')return window.openNetworkLM();
 }catch(e){console.warn('L&M quick action',e)}
}

let scheduled=false;
function enhance(){scheduled=false;decorateNav();injectQuickActions();enhanceSales();ensureFab()}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('DOMContentLoaded',schedule);setTimeout(schedule,400);setTimeout(schedule,1200);
Object.assign(window,{lmQuick,toggleLmActions});
})();
