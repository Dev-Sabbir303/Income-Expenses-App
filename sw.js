const C='money-track-v23';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(['./index.html','./fonts.css','./icons.js'].map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='mt-data').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith(caches.open(C).then(c=>c.match(e.request).then(m=>{
    const f=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>m||c.match('./index.html'));
    return m||f;
  })));
});
self.addEventListener('periodicsync',e=>{
  if(e.tag!=='shop-check')return;
  e.waitUntil(caches.open('mt-data').then(c=>c.match(self.registration.scope+'__shop.json')).then(r=>r?r.json():[]).then(l=>{
    const o=l.filter(x=>Date.now()-x.ts>20*864e5);
    if(!o.length)return;
    return self.registration.showNotification('Money Track',{body:o.length+' টি টাস্ক ২০ দিনের বেশি ধরে সম্পন্ন হয়নি: '+o.slice(0,3).map(x=>x.n).join(', '),tag:'shop'});
  }).catch(()=>{}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():clients.openWindow('./')));
});
