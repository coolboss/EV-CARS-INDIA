const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1100,height:800}}); const p=await ctx.newPage(); const errs=[],reqs=[];
p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); p.on('request',r=>{const u=r.url(); if(!u.startsWith('http://localhost')) reqs.push(u.slice(0,80));});
await p.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url(); if(/maps\.google/.test(u)) return r.fulfill({status:200,contentType:'text/html',body:'<p>map</p>'}); if(/googleapis/.test(u)) return r.fulfill({status:200,contentType:'text/css',body:''}); return r.abort();});
await p.addInitScript(()=>{window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push(e.violatedDirective+' '+e.blockedURI));});
const r=await p.goto('http://localhost:8765/EV-CARS-INDIA/#money'); console.log('status',r.status(),'url',p.url());
await p.waitForTimeout(400); console.log('title',await p.title());
for(const v of ['cars','charging','map','buy','learn']){ await p.click('.tabs [data-tab="'+v+'"]'); await p.waitForTimeout(150);} 
await p.click('.tabs [data-tab="map"]'); await p.fill('#lv-q','Vadodara'); await p.click('#lv-go'); await p.waitForTimeout(400);
console.log('iframe',await p.evaluate(()=>{const f=document.querySelector('#lv-box iframe'); return f?f.src+' | sandbox='+f.getAttribute('sandbox')+' | referrer='+f.referrerPolicy:'none'}));
console.log('csp violations',JSON.stringify(await p.evaluate(()=>window.__csp)),'| errors',JSON.stringify(errs),'| external requests',JSON.stringify([...new Set(reqs)]));
const r2=await p.goto('http://localhost:8765/EV-CARS-INDIA'); console.log('no trailing slash ->',r2.status(),p.url());
await b.close()})();
