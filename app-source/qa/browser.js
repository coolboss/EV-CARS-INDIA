const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const FILE=process.argv[2]||'../dist/index.html', STD=!/artifact/.test(FILE);
const URL='file://'+path.resolve(__dirname,FILE);
const TABS=['learn','cars','charging','map','money','buy'];
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
let fails=0,warns=0; const F=m=>{fails++;console.log('FAIL',m)}, W=m=>{warns++;console.log('WARN',m)};
const external=new Set();
async function newPage(b,vp,scheme,extra){
  const ctx=await b.newContext(Object.assign({viewport:vp,colorScheme:scheme,deviceScaleFactor:1},extra||{})); const p=await ctx.newPage(); p._errs=[];
  await p.route('**/*',r=>{ const u=r.request().url();
    if(u.startsWith('file:')||u.startsWith('data:')) return r.continue();
    if(/fonts\.googleapis\.com/.test(u)) return r.fulfill({status:200,contentType:'text/css',body:''});
    if(/fonts\.gstatic\.com/.test(u)) return r.abort();
    if(/maps\.google\.com/.test(u)){ external.add(u); return r.fulfill({status:200,contentType:'text/html',body:'<html><body>map stub</body></html>'}); }
    external.add('BLOCKED '+u); return r.abort(); });
  p.on('pageerror',e=>p._errs.push('PAGEERROR '+e.message)); p.on('console',m=>{ if(m.type()==='error'||m.type()==='warning'){ const t=m.text(); if(!/Failed to load resource|ERR_FAILED|net::ERR/.test(t)) p._errs.push('CONSOLE '+m.type()+' '+t.slice(0,200)); } });
  return p;
}
const go=async(p,t)=>{ await p.evaluate(t=>{location.hash=t},t); await p.waitForTimeout(120); };
const viewText=p=>p.evaluate(()=>document.querySelector('.view:not([hidden])').innerText);
(async()=>{
 const b=await chromium.launch();
 // ---------- A+B+C: matrix
 const seenAudit={};
 for(const w of [360,390,768,1024,1366]) for(const scheme of ['light','dark']){
  const p=await newPage(b,{width:w,height:w<500?800:900},scheme); await p.goto(URL); await p.waitForTimeout(250);
  for(const t of TABS){
    await go(p,t);
    const r=await p.evaluate(()=>{
      const out={}; out.sw=document.documentElement.scrollWidth; out.iw=innerWidth;
      const vis=document.querySelector('.view:not([hidden])'); out.text=vis.innerText;
      out.bad=[]; vis.querySelectorAll('*').forEach(e=>{ const r=e.getBoundingClientRect(); if(r.width&&r.right>innerWidth+1&&!e.closest('.tbl,.jump,[style*="overflow-x"]')) out.bad.push(e.tagName+'.'+(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className)+' '+Math.round(r.right)); });
      return out; });
    if(r.sw>r.iw+1) F(`${w}px ${scheme} ${t}: horizontal scroll ${r.sw}>${r.iw}`);
    if(r.bad.length) F(`${w}px ${scheme} ${t}: overflowing elements ${r.bad.slice(0,4).join(', ')}`);
    const m=r.text.match(/NaN|undefined|Infinity|\[object|null\b/g); if(m) F(`${w}px ${scheme} ${t}: bad text ${m.join(',')}`);
    if(w===390&&scheme==='dark') await p.screenshot({path:`../shots/q-${t}-390-dark.png`,fullPage:true});
    if(w===1366&&scheme==='light') await p.screenshot({path:`../shots/q-${t}-1366-light.png`,fullPage:true});
    if(w===390&&scheme==='light'){ // DOM audit once per view
      const a=await p.evaluate(()=>{ const v=document.querySelector('.view:not([hidden])'), o={};
        const ids={}; document.querySelectorAll('[id]').forEach(e=>ids[e.id]=(ids[e.id]||0)+1); o.dup=Object.keys(ids).filter(k=>ids[k]>1);
        o.unlabeled=[]; v.querySelectorAll('input,select,textarea').forEach(e=>{ const lab=e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')||(e.id&&document.querySelector('label[for="'+e.id+'"]'))||e.closest('label'); if(!lab) o.unlabeled.push(e.tagName+'#'+e.id+' '+e.type); });
        o.noname=[]; v.querySelectorAll('button,a[href]').forEach(e=>{ if(!(e.innerText||'').trim()&&!e.getAttribute('aria-label')&&!e.getAttribute('title')) o.noname.push(e.outerHTML.slice(0,80)); });
        o.rel=[]; document.querySelectorAll('a[target="_blank"]').forEach(e=>{ if(!/noopener/.test(e.rel)) o.rel.push(e.href); });
        o.http=[]; document.querySelectorAll('a[href]').forEach(e=>{ if(/^http:\/\//.test(e.getAttribute('href'))) o.http.push(e.href); });
        o.jump=[]; v.querySelectorAll('[data-jump]').forEach(e=>{ if(!document.getElementById(e.getAttribute('data-jump'))) o.jump.push(e.getAttribute('data-jump')); });
        o.go=[]; v.querySelectorAll('[data-go]').forEach(e=>{ if(!['learn','cars','charging','map','money','buy'].includes(e.getAttribute('data-go'))) o.go.push(e.getAttribute('data-go')); });
        o.h1=v.querySelectorAll('h1').length; let last=1; o.skip=[]; v.querySelectorAll('h1,h2,h3,h4').forEach(h=>{ const n=+h.tagName[1]; if(n>last+1) o.skip.push(h.tagName+' after h'+last+': '+h.innerText.slice(0,30)); last=n; });
        o.small=[]; v.querySelectorAll('button,a.btn,select,input:not([type=checkbox]):not([type=range]),summary').forEach(e=>{ const r=e.getBoundingClientRect(); if(r.width&&r.height&&(r.height<36)) o.small.push((e.innerText||e.id||e.tagName).slice(0,25)+' '+Math.round(r.height)); });
        o.nodes=document.querySelectorAll('*').length; return o; });
      if(a.dup.length) F(`${t}: duplicate ids ${a.dup}`); if(a.unlabeled.length) F(`${t}: inputs without label ${a.unlabeled.slice(0,5)}`); if(a.noname.length) F(`${t}: controls without name ${a.noname.slice(0,3)}`);
      if(a.rel.length) F(`${t}: target=_blank without noopener ${a.rel.slice(0,3)}`); if(a.http.length) F(`${t}: http links ${a.http}`); if(a.jump.length) F(`${t}: broken data-jump ${a.jump}`); if(a.go.length) F(`${t}: bad data-go ${a.go}`);
      if(a.h1!==1) F(`${t}: ${a.h1} h1 elements`); if(a.skip.length) W(`${t}: heading level skips ${a.skip.slice(0,3)}`); if(a.small.length) W(`${t}: small tap targets (${a.small.length}) e.g. ${a.small.slice(0,4)}`);
      seenAudit[t]=a.nodes;
    }
  }
  const e=[...new Set(p._errs)]; if(e.length) F(`${w}px ${scheme}: console/page errors ${JSON.stringify(e.slice(0,4))}`);
  await p.context().close();
 }
 console.log('DOM nodes (all views built):',JSON.stringify(seenAudit));
 // ---------- D: interaction fuzz
 { const p=await newPage(b,{width:1100,height:900},'light'); await p.goto(URL); await p.waitForTimeout(200); let steps=0;
  for(const t of TABS){ await go(p,t);
    const ctrls=await p.evaluate(()=>[...document.querySelectorAll('.view:not([hidden]) select,.view:not([hidden]) input[type=range],.view:not([hidden]) input[type=number],.view:not([hidden]) input[type=search]')].map(e=>e.id).filter(Boolean));
    for(const id of ctrls){ const info=await p.evaluate(id=>{const e=document.getElementById(id);return {type:e.type,opts:e.tagName==='SELECT'?[...e.options].map(o=>o.value):null,min:e.min,max:e.max,step:e.step};},id);
      const vals= info.opts? info.opts : info.type==='range'? [info.min,String((+info.min+ +info.max)/2),info.max] : info.type==='number'? [info.min,info.max,'',"-5",'0','99999999','abc'.length?'1':''] : ['','zzzz','tata','  ','<b>x</b>'];
      for(const v of vals){ await p.evaluate(([id,v])=>{const e=document.getElementById(id); e.value=v; e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true}));},[id,v]); steps++;
        const bad=await p.evaluate(()=>(document.querySelector('.view:not([hidden])').innerText.match(/NaN|undefined|Infinity|\[object/g)||[]).length); if(bad) F(`fuzz ${t}#${id}=${JSON.stringify(v)} produced bad text`); } } }
  const e=[...new Set(p._errs)]; if(e.length) F('fuzz errors '+JSON.stringify(e.slice(0,4))); console.log('fuzz steps',steps); await p.context().close(); }
 // ---------- E: behaviours
 { const ctx=await b.newContext({viewport:{width:1100,height:900},colorScheme:'light',permissions:[]}); const p=await ctx.newPage(); p._errs=[]; p.on('pageerror',e=>p._errs.push(e.message));
   await p.route('**/*',r=>{ const u=r.request().url(); if(/^(file|data):/.test(u)) return r.continue(); if(/fonts\.googleapis/.test(u)) return r.fulfill({status:200,contentType:'text/css',body:''}); if(/maps\.google\.com/.test(u)) return r.fulfill({status:200,contentType:'text/html',body:'stub'}); return r.abort(); });
   await p.goto(URL); await p.waitForTimeout(200);
   const view=()=>p.evaluate(()=>[...document.querySelectorAll('.view')].find(v=>!v.hidden).id);
   ok(await view()==='v-learn','default view is learn'); await p.evaluate(()=>{location.hash='nonsense'}); await p.waitForTimeout(100); ok(await view()==='v-learn','unknown hash falls back'); 
   for(const t of TABS){ await p.click(`.tabs a[data-tab="${t}"]`); await p.waitForTimeout(80); ok(await view()==='v-'+t,'tab click '+t); ok(await p.evaluate(()=>location.hash)==='#'+t,'hash '+t); ok(await p.evaluate(t=>document.querySelector('.tabs a[aria-current="page"]').dataset.tab===t,t),'aria-current '+t); }
   await p.goBack(); await p.waitForTimeout(100); ok(await view()==='v-money','back button -> money');
   // theme
   await p.click('#themebtn'); const th=await p.evaluate(()=>document.documentElement.getAttribute('data-theme')); ok(th==='dark','theme toggles to dark (system light)'); const bg=await p.evaluate(()=>getComputedStyle(document.body).backgroundColor); ok(bg==='rgb(12, 20, 27)','dark bg applied '+bg);
   await p.reload(); await p.waitForTimeout(200); ok(await p.evaluate(()=>document.documentElement.getAttribute('data-theme'))==='dark','theme persists after reload'); await p.click('#themebtn'); ok(await p.evaluate(()=>document.documentElement.getAttribute('data-theme'))==='light','toggle back');
   // cars: favourites, compare persistence
   await go(p,'cars'); await p.evaluate(()=>document.getElementById('cars-all').scrollIntoView());
   const nCards=await p.evaluate(()=>document.querySelectorAll('#x-out .car').length); ok(nCards>=30,'explorer shows many cars, got '+nCards);
   await p.click('#x-out .car:nth-child(1) [data-act="fav"]'); await p.click('#x-out .car:nth-child(2) [data-act="fav"]'); ok(await p.textContent('#favcount')==='2','fav count 2'); 
   await p.click('#x-out .car:nth-child(1) [data-act="cmp"]'); await p.click('#x-out .car:nth-child(3) [data-act="cmp"]'); ok(await p.evaluate(()=>document.querySelectorAll('#cmp-out table').length)===1,'compare table appears');
   await p.reload(); await p.waitForTimeout(250); await go(p,'cars'); ok(await p.textContent('#favcount')==='2','fav persists'); ok(await p.evaluate(()=>document.querySelectorAll('#x-out [data-act="fav"][aria-pressed="true"]').length)===2,'hearts restored'); ok(await p.evaluate(()=>document.querySelectorAll('#x-out [data-act="cmp"]:checked').length)===2,'compare restored');
   await p.click('#favlink'); await p.waitForTimeout(250); ok(await p.evaluate(()=>document.querySelectorAll('#x-out .car').length)===2,'saved-only filter shows 2');
   await p.click('#x-fav'); // off
   await p.click('#cmpbar [data-act="clr"]'); ok(await p.evaluate(()=>document.querySelectorAll('#x-out [data-act="cmp"]:checked').length)===0,'compare cleared');
   await p.evaluate(()=>{const e=document.getElementById('x-q');e.value='creta';e.dispatchEvent(new Event('input',{bubbles:true}));}); ok(await p.evaluate(()=>document.querySelectorAll('#x-out .car').length)===1,'search creta -> 1');
   await p.evaluate(()=>{const e=document.getElementById('x-q');e.value='';e.dispatchEvent(new Event('input',{bubbles:true}));});
   // 4th compare blocked
   // learn: quiz & glossary
   await go(p,'learn'); const hasQuiz=await p.evaluate(()=>!!document.querySelector('#v-learn [data-q]')||!!document.querySelector('#v-learn .quiz')); 
   // charging calc
   await go(p,'charging'); await p.selectOption('#c-car','ioniq5'); await p.click('#c-type [data-v="dc"]'); await p.selectOption('#c-kw','360'); await p.evaluate(()=>{const f=document.getElementById('c-f');f.value=20;f.dispatchEvent(new Event('input',{bubbles:true}));const t=document.getElementById('c-t');t.value=80;t.dispatchEvent(new Event('input',{bubbles:true}));});
   const out=await p.textContent('#c-out'); ok(/1[5-7] min/.test(out),'Ioniq 5 20-80 on 360kW ~16 min: '+out.slice(0,60));
   await p.selectOption('#c-car','comet'); ok(/AC only|AC on/i.test(await p.textContent('#c-out'))||/charges on AC only/.test(await p.textContent('#c-out')),'AC-only car message in DC mode');
   // map: schematic node click, live map
   await go(p,'map'); await p.click('g[data-node="vadodara"]'); ok(/Vadodara/.test(await p.textContent('#nodecard')),'node card opens');
   ok(await p.evaluate(()=>!!document.querySelector('#nodecard a[href^="https://www.google.com/maps/search/EV+charging+station"]')),'node card has live-map link');
   if(STD){ await p.click('#nodecard [data-live]'); await p.waitForTimeout(200); const src=await p.evaluate(()=>{const f=document.querySelector('#lv-box iframe');return f&&f.src}); ok(src&&src.startsWith('https://maps.google.com/maps?q=EV%20charging%20stations%20near%20Vadodara')&&/output=embed/.test(src),'live map iframe src '+src);
     await p.fill('#lv-q','Pune <script>alert(1)</script>'); await p.click('#lv-go'); const s2=await p.evaluate(()=>document.querySelector('#lv-box iframe').src); ok(!/<script/.test(s2)&&/%3Cscript/.test(s2),'query is URL-encoded'); ok(await p.evaluate(()=>!document.querySelector('#lv-msg script')),'no injected script');
     await p.fill('#lv-q',''); await p.click('#lv-go'); ok(/Type a city/.test(await p.textContent('#lv-msg')),'empty search message');
     await p.click('#lv-loc'); await p.waitForTimeout(400); ok(/(not shared|cannot|not available)/i.test(await p.textContent('#lv-msg')),'geolocation denied path: '+await p.textContent('#lv-msg')); }
   else { await p.click('#lv-chips [data-city="Pune"]'); ok(await p.evaluate(()=>!document.querySelector('#lv-box iframe')&&!!document.querySelector('#lv-box a[href^="https://maps.google.com"]')),'artifact build: no iframe, link instead'); }
   // trip planner
   const pairs=[['delhi','jaipur'],['mumbai','delhi'],['bengaluru','chennai'],['kochi','guwahati'],['vadodara','vadodara']];
   for(const [a,c] of pairs){ await p.selectOption('#p-from',a); await p.selectOption('#p-to',c); const t=await p.textContent('#p-out'); ok(!/NaN|undefined/.test(t),`planner ${a}-${c} clean`); if(a!==c){ const n=await p.evaluate(()=>document.querySelectorAll('#routeg .stop').length); const stops=/Fast-charge stops(\d+|None)/.exec(t.replace(/\s+/g,'')); } }
   await p.selectOption('#p-from','mumbai'); await p.selectOption('#p-to','delhi'); ok(await p.evaluate(()=>document.querySelectorAll('#routeg .stop').length)>=2,'long route draws stops'); ok(await p.evaluate(()=>!!document.querySelector('#routeg polyline')),'route polyline drawn');
   // money
   await go(p,'money'); const bo=await p.evaluate(()=>[...document.getElementById('b-car').options].map(o=>o.value)); let incompleteSeen=0; for(const id of bo){ await p.selectOption('#b-car',id); const t=await p.textContent('#b-out'); if(/Numbers do not add up/.test(t)) incompleteSeen++; ok(/Verdict for your numbers/.test(t)&&!/NaN/.test(t),'baas output '+id); } ok(incompleteSeen===4,'4 cars flagged as incomplete BaaS quotes, got '+incompleteSeen);
   await p.selectOption('#b-car','windsor'); await p.evaluate(()=>{const e=document.getElementById('b-k');e.value=10000;e.dispatchEvent(new Event('input',{bubbles:true}));}); ok(/11\.3 years|6\.3 years|1,13,023/.test(await p.textContent('#b-out')),'windsor break-even text');
   ok(await p.evaluate(()=>!!document.querySelector('#b-chart svg path')),'baas chart drawn');
   // buy: checklist persistence
   await go(p,'buy'); await p.click('#v-buy details.chk[open] input[type=checkbox] >> nth=0'); await p.click('#v-buy details.chk[open] input[type=checkbox] >> nth=1'); ok(/2 of \d+ ticked/.test(await p.textContent('#chk-n-dealer')),'checklist count'); await p.reload(); await p.waitForTimeout(250); await go(p,'buy'); ok(/2 of \d+ ticked/.test(await p.textContent('#chk-n-dealer')),'checklist persists');
   const e=[...new Set(p._errs)]; if(e.length) F('behaviour errors '+JSON.stringify(e)); await ctx.close(); }
 // ---------- F: axe
 for(const w of [390,1366]) for(const scheme of ['light','dark']){
   const p=await newPage(b,{width:w,height:900},scheme); await p.goto(URL); await p.waitForTimeout(200); await p.evaluate(AXE);
   for(const t of TABS){ await go(p,t); await p.waitForTimeout(100);
     const res=await p.evaluate(async()=>{ const r=await axe.run(document.querySelector('.view:not([hidden])').parentElement.parentElement,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}}); return r.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,ex:v.nodes.slice(0,3).map(n=>n.target.join(' ')+' :: '+(n.any[0]&&n.any[0].message||n.failureSummary||'').slice(0,130))})); });
     res.forEach(v=>{ (v.impact==='critical'||v.impact==='serious'?F:W)(`axe ${w}px ${scheme} ${t}: ${v.id} (${v.impact}) x${v.n} e.g. ${v.ex[0]}`); }); }
   await p.context().close(); }
 // ---------- G: perf
 { const p=await newPage(b,{width:390,height:800},'light'); await p.goto(URL); const tt={}; for(const t of TABS){ const ms=await p.evaluate(t=>{ const s=performance.now(); location.hash=t; return new Promise(r=>setTimeout(()=>r(performance.now()-s),0)); },t); tt[t]=Math.round(ms); } console.log('view switch ms',JSON.stringify(tt)); await p.context().close(); }
 console.log('external requests seen:',[...external].slice(0,6));
 await b.close(); console.log(`BROWSER QA (${STD?'standalone':'artifact'}): ${fails} fail, ${warns} warn`); process.exit(fails?1:0);
 function ok(c,m){ if(!c) F('behaviour: '+m); }
})();
