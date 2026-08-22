const CACHE='lm-importadora-v1.3.3b';
const BASE='/IMPORTADORA-L-M/';
const CORE=[
  BASE,
  BASE+'index.html',
  BASE+'styles.css',
  BASE+'styles-extra.css',
  BASE+'network.css',
  BASE+'auth-fix.css',
  BASE+'app.js',
  BASE+'manifest.webmanifest',
  BASE+'js/config.js',
  BASE+'js/catalog-pdf.js',
  BASE+'js/network.js',
  BASE+'js/auth-fix.js',
  BASE+'js/pwa.js',
  BASE+'icons/icon-192.svg',
  BASE+'icons/icon-512.svg',
  BASE+'icons/icon-lm-maskable.svg'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{
      const clone=res.clone();caches.open(CACHE).then(c=>c.put(BASE,clone));return res;
    }).catch(()=>caches.match(BASE)));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone));return res;
  })));
});