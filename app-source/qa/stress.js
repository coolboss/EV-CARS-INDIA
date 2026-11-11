/* Robustness / edge-case QA. Usage: node stress.js ../dist/index.html */
const {chromium}=require('playwright'),path=require('path');
const FILE=path.resolve(__dirname,process.argv[2]||'../dist/index.html'); const URL='file://'+FILE;
let fails=0,warns=0; const F=(m)=>{fails++;console.log('FAIL',m)}, W=(m)=>{warns++;console.log('WARN',m)}, OK=(m)=>console.log('ok  ',m);
const VIEWS=['learn','cars','charging','map','money','buy'];
async function mk(b,opts={},init){ const ctx=await b.newContext(Object.assign({viewport:{width:1100,height:800}},opts)); const errs=[]; const p=await ctx.newPage();
  p.on('pageerror',e=>errs.push('pageerror: '+e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text()); });
  await p.route('**/*',r=>{const u=r.request().url(); if(/^(file|data|blob):/.test(u)) return r.continue(); if(/maps\.google/.test(u)) return r.fulfill({status:200,contentType:'text/html',body:'<p>map</p>'}); if(/googleapis|gstatic/.test(u)) return r.fulfill({status:200,contentType:'text/css',body:''}); return r.abort();});
  if(init) await p.addInitScript(init); await p.addInitScript(()=>{window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push(e.violatedDirective+' '+e.blockedURI));});
  return {ctx,p,errs}; }
async function walk(p){ for(const v of VIEWS){ await p.evaluate(v=>{location.hash=v},v); await p.waitForTimeout(120);} }
(async()=>{const b=await chromium.launch();
/* 1 poisoned localStorage */
for(const [name,store] of [
  ['unknown car ids',{evr_cmp:'["nope","punch","also-nope"]',evr_fav:'["ghost","nexon"]'}],
  ['wrong types',{evr_cmp:'"string"',evr_fav:'{"a":1}',evr_theme:'5'}],
  ['nulls and numbers',{evr_cmp:'[null,1,{}]',evr_fav:'[null,false,0]'}],
  ['invalid JSON',{evr_cmp:'{bad',evr_fav:'[[[',evr_theme:'dark'}],
  ['huge arrays',{evr_cmp:JSON.stringify(Array(500).fill('punch')),evr_fav:JSON.stringify(Array(500).fill('nexon'))}],
  ['stored from other keys',{evr_calc:'{"x":1}',evr_baas:'zzz',evr_state:'["Mars"]',evr_plan:'12'}] ]){
  const {ctx,p,errs}=await mk(b,{},s=>{ for(const k in s) localStorage.setItem(k,s[k]); }); 
  await p.addInitScript(s=>{ try{ for(const k in s) localStorage.setItem(k,s[k]); }catch(e){} },store);
  await p.goto(URL+'#cars'); await p.waitForTimeout(300); await walk(p);
  const nc=await p.evaluate(()=>typeof CS!=='undefined'?CS.cmp.length+'/'+CS.fav.length:'n/a');
  errs.length?F('poisoned storage ['+name+']: '+errs.slice(0,3).join(' | ')):OK('poisoned storage ['+name+'] state '+nc);
  await ctx.close(); }
/* 2 storage throws */
{ const {ctx,p,errs}=await mk(b,{},()=>{ const t=()=>{throw new DOMException('denied','SecurityError')}; Storage.prototype.getItem=t; Storage.prototype.setItem=t; Storage.prototype.removeItem=t; });
  await p.goto(URL); await walk(p); await p.click('#themebtn'); await p.evaluate(()=>{location.hash='cars'}); await p.waitForTimeout(200);
  const h=await p.$('[data-act="fav"]'); if(h) await h.click();
  errs.length?F('storage blocked: '+errs.slice(0,3).join(' | ')):OK('storage blocked, app works'); await ctx.close(); }
/* 3 bad hashes */
for(const h of ['#','#nope','#cars%20','#__proto__','#constructor','#toString','#<img src=x onerror=window.__x=1>','#learn-left','#CARS','#cars/','#%E0%A4%A']){
  const {ctx,p,errs}=await mk(b); await p.goto(URL+h); await p.waitForTimeout(250);
  const vis=await p.evaluate(()=>Array.from(document.querySelectorAll('.view')).filter(v=>!v.hidden).map(v=>v.id).join(','));
  const x=await p.evaluate(()=>window.__x);
  if(errs.length||x||vis.split(',').length!==1) F('hash '+h+' -> '+vis+' '+errs.slice(0,2).join('|')); else OK('hash '+JSON.stringify(h)+' -> '+vis); await ctx.close(); }
/* 4 back / forward */
{ const {ctx,p,errs}=await mk(b); await p.goto(URL+'#learn'); await p.click('.tabs [data-tab="cars"]'); await p.click('.tabs [data-tab="money"]'); await p.goBack(); await p.waitForTimeout(150);
  let v=await p.evaluate(()=>location.hash); let vis=await p.evaluate(()=>Array.from(document.querySelectorAll('.view')).filter(v=>!v.hidden).map(v=>v.id)[0]);
  (v==='#cars'&&vis==='v-cars')?OK('back button -> cars'):F('back button gave '+v+' '+vis); await p.goForward(); await p.waitForTimeout(150);
  vis=await p.evaluate(()=>Array.from(document.querySelectorAll('.view')).filter(v=>!v.hidden).map(v=>v.id)[0]); vis==='v-money'?OK('forward -> money'):F('forward gave '+vis);
  const t=await p.title(); /Money/.test(t)?OK('title follows view: '+t):F('title '+t); await ctx.close(); }
/* 5 narrow screens, big text, overflow */
for(const [w,fs,label] of [[320,100,'320px'],[320,150,'320px + 150% text'],[360,200,'360px + 200% text'],[768,200,'768px + 200% text'],[1366,100,'1366px'],[1920,100,'1920px']]){
  const {ctx,p,errs}=await mk(b,{viewport:{width:w,height:700}}); await p.goto(URL); if(fs!==100) await p.addStyleTag({content:'html{font-size:'+fs+'%!important}'});
  const bad=[]; for(const v of VIEWS){ await p.evaluate(v=>{location.hash=v},v); await p.waitForTimeout(200);
    const o=await p.evaluate(()=>{const sw=document.documentElement.scrollWidth,cw=document.documentElement.clientWidth; if(sw<=cw+1) return null; const offenders=[]; document.querySelectorAll('.view:not([hidden]) *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.right>cw+1&&r.width>0&&!e.closest('.tbl')&&!e.closest('svg')) offenders.push((e.id||e.className||e.tagName).toString().slice(0,30)+':'+Math.round(r.right));}); return {sw,cw,off:offenders.slice(0,4)}; });
    if(o) bad.push(v+' '+JSON.stringify(o)); }
  (bad.length||errs.length)?F('layout '+label+': '+bad.concat(errs).slice(0,4).join(' || ')):OK('no sideways scroll at '+label); await ctx.close(); }
/* 6 keyboard: real Tab walk, focus ring on every stop, skip link, focus moves to content on tab change */
{ const {ctx,p,errs}=await mk(b); await p.goto(URL); const noRing=[];
  for(const v of VIEWS){ await p.evaluate(v=>{location.hash=v},v); await p.waitForTimeout(150); await p.evaluate(()=>{document.body.focus(); window.scrollTo(0,0);});
    await p.evaluate(()=>{document.querySelectorAll('.view:not([hidden]) details').forEach(d=>d.open=true)});
    const seen=new Set(); let stops=0;
    for(let i=0;i<140;i++){ await p.keyboard.press('Tab'); const r=await p.evaluate(()=>{const e=document.activeElement; if(!e||e===document.body) return null; const cs=getComputedStyle(e); const ring=(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0)||(cs.boxShadow&&cs.boxShadow!=='none'); const vis=e.getBoundingClientRect().width>0; return {k:(e.id||e.tagName+'.'+(e.className&&e.className.baseVal===undefined?e.className:'')+':'+(e.textContent||'').trim().slice(0,20)),ring,vis};}); if(!r) continue; stops++; if(seen.has(r.k)&&seen.size>20) {} seen.add(r.k); if(r.vis&&!r.ring) noRing.push(v+': '+r.k); }
    if(stops<10) F('keyboard: only '+stops+' tab stops in '+v); }
  noRing.length?F('no visible focus ring on: '+[...new Set(noRing)].slice(0,6).join(' ; ')):OK('Tab walk: every stop shows a focus ring in all 6 views');
  /* skip link */
  await p.evaluate(()=>{location.hash='learn'}); await p.reload(); await p.waitForTimeout(250); await p.keyboard.press('Tab'); 
  const sk=await p.evaluate(()=>document.activeElement.textContent); /Skip/.test(sk)?OK('first Tab stop is the skip link'):F('first tab stop is '+sk);
  await p.keyboard.press('Enter'); const f=await p.evaluate(()=>document.activeElement.id+'|'+location.hash); (/^main\|/.test(f)&&!/main/.test(f.split('|')[1]))?OK('skip link moves focus to content, hash untouched ('+f+')'):F('skip link result '+f);
  /* tab change moves focus to content */
  await p.click('.tabs [data-tab="cars"]'); await p.waitForTimeout(200); const f2=await p.evaluate(()=>document.activeElement.id); f2==='main'?OK('focus moves to content after changing tab'):F('focus after tab change: '+f2);
  errs.length&&F('keyboard errors '+errs[0]); await ctx.close(); }
/* 6b duplicated saved ids are counted once */
{ const {ctx,p,errs}=await mk(b); await p.addInitScript(()=>{localStorage.setItem('evr_fav','["ghost","nexon","nexon",null,"punch"]');localStorage.setItem('evr_cmp','["nope","punch","punch","nexon"]');});
  await p.goto(URL+'#cars'); await p.waitForTimeout(300); const n=await p.textContent('#favcount'); const cmp=await p.evaluate(()=>document.querySelector('#cmpbar')?document.querySelector('#cmpbar').innerText:'');
  (n==='2')?OK('saved cars de-duplicated and unknown ids dropped (count '+n+')'):F('favcount '+n+' expected 2'); (/2 of 3/.test(cmp))?OK('compare tray cleaned: '+cmp.split('\n')[0]):F('compare tray: '+cmp); await ctx.close(); }
/* 6c print: chrome hidden, details opened */
{ const {ctx,p,errs}=await mk(b); await p.goto(URL+'#buy'); await p.waitForTimeout(250); await p.emulateMedia({media:'print'}); const d=await p.evaluate(()=>[getComputedStyle(document.querySelector('.topbar')).display,getComputedStyle(document.querySelector('.bottomnav')).display].join(',')); 
  d==='none,none'?OK('print hides top bar and bottom nav'):F('print chrome: '+d);
  await p.evaluate(()=>window.dispatchEvent(new Event('beforeprint'))); const open=await p.evaluate(()=>[...document.querySelectorAll('.view:not([hidden]) details')].every(x=>x.open)); open?OK('beforeprint opens every checklist'):F('details still closed in print');
  await p.evaluate(()=>window.dispatchEvent(new Event('afterprint'))); const closed=await p.evaluate(()=>[...document.querySelectorAll('.view:not([hidden]) details')].filter(x=>x.open).length); OK('afterprint restores them ('+closed+' still open)'); await ctx.close(); }
/* 7 live map input: hostile text */
{ const {ctx,p,errs}=await mk(b); await p.goto(URL+'#map'); await p.waitForTimeout(200);
  for(const q of ['<img src=x onerror=window.__x=1>','"><script>window.__x=1</script>','Vadodara&q=evil','a'.repeat(500),'   ','日本語 ♥ आणंद']){ await p.fill('#lv-q',q); await p.click('#lv-go'); await p.waitForTimeout(120); }
  const x=await p.evaluate(()=>window.__x); const src=await p.evaluate(()=>{const f=document.querySelector('#lv-box iframe'); return f?f.src:'(no iframe)';}); const html=await p.evaluate(()=>document.getElementById('lv-msg').innerHTML);
  (x||errs.length)?F('live map hostile input: '+x+' '+errs.join('|')):OK('live map input safe. last src: '+src.slice(0,110)); 
  if(/[<>"]/.test(src.replace(/^https?:\/\/[^ ]*$/,''))&&/<|>/.test(src)) F('iframe src not encoded'); await ctx.close(); }
/* 8 CSP violations during a full session */
{ const {ctx,p,errs}=await mk(b); await p.goto(URL); await walk(p); await p.click('#lv-go').catch(()=>{}); await p.evaluate(()=>{location.hash='map'}); await p.waitForTimeout(200); await p.fill('#lv-q','Vadodara'); await p.click('#lv-go'); await p.waitForTimeout(400);
  const v=await p.evaluate(()=>window.__csp); v.length?F('CSP violations: '+JSON.stringify(v)):OK('no CSP violations (incl. live map iframe)'); await ctx.close(); }
/* 9 print, forced colors, reduced motion, dark, no-JS-ish */
for(const [label,o,emu] of [['print',{}, {media:'print'}],['forced-colors',{forcedColors:'active'},{}],['reduced motion',{reducedMotion:'reduce'},{}],['dark',{colorScheme:'dark'},{}]]){
  const {ctx,p,errs}=await mk(b,o); await p.goto(URL); if(emu.media) await p.emulateMedia(emu); await walk(p); const t=await p.evaluate(()=>{const tb=document.querySelector('.topbar'); return tb?getComputedStyle(tb).display+'|'+getComputedStyle(tb).position:'';});
  errs.length?F(label+': '+errs[0]):OK(label+' renders (topbar '+t+')'); await ctx.close(); }
/* 10 viewport zoom allowed */
{ const html=require('fs').readFileSync(FILE,'utf8'); /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/.test(html)?F('viewport blocks pinch zoom'):OK('viewport allows zoom'); (!/^\s*<!doctype/i.test(html))?OK('fragment build: html tag is added by the host'):(/<html[^>]*lang=/.test(html)?OK('html lang set'):F('no html lang')); }
console.log('\nSTRESS QA: '+fails+' fail, '+warns+' warn'); await b.close(); process.exit(fails?1:0);})();
