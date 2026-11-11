/* ===== App shell: tabs, router, lazy views ===== */
var VIEWS=[
 ['learn','Learn',viewLearn,function(r){bindLearn(r);}],
 ['cars','Cars',viewCars,function(r){bindCars(r);}],
 ['charging','Charging',viewCharging,function(){bindCharging();}],
 ['map','Map',viewMap,function(){bindMap();}],
 ['money','Money',viewMoney,function(){bindMoney();}],
 ['buy','Buy',viewBuy,function(){bindBuy();}]
];
var _built={};
function buildShell(){
  var top='<a class="skip" href="#main" data-skip="1">Skip to content</a><header class="topbar"><div class="wrap"><a class="brand" href="#learn"><span class="sign">EV Raasta</span><small>Electric cars in India, explained</small></a><nav class="tabs" aria-label="Sections">'+VIEWS.map(function(v){return '<a href="#'+v[0]+'" data-tab="'+v[0]+'">'+v[1]+'</a>';}).join('')+'</nav><div class="tools"><button class="tbtn" id="favlink" aria-label="Show my saved cars" title="Saved cars">♥ <span id="favcount">0</span></button><button class="tbtn" id="themebtn" aria-label="Switch between light and dark" title="Light or dark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg></button></div></div></header>';
  var main='<main class="wrap" id="main" tabindex="-1">'+VIEWS.map(function(v){return '<div class="view" id="v-'+v[0]+'" hidden></div>';}).join('')+
    '<footer><p><b>EV Raasta</b> · Data gathered November 2026 from maker pages, road tests, enthusiast and news sites. Prices, rental rates, state rules and charger counts change often, so confirm with the dealer. Not financial or legal advice. Not affiliated with any car maker or charging company.</p><p>India state outlines: <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noopener">svg-maps</a> (CC BY 4.0). The map is a simple schematic, not an official boundary map.</p></footer></main>';
  var nav='<nav class="bottomnav" aria-label="Sections">'+VIEWS.map(function(v){return '<a href="#'+v[0]+'" data-tab="'+v[0]+'">'+ICONS[v[0]]+'<span>'+v[1]+'</span></a>';}).join('')+'</nav>';
  document.getElementById('app').innerHTML=top+main+nav;
}
/* Keep heading levels in order for screen readers (no jumps such as h2 to h4). Look stays the same via data-vis. */
function fixHeadings(root){
  var last=0; $$('h1,h2,h3,h4',root).forEach(function(h){
    var n=+h.tagName.charAt(1), a=Math.min(n,last+1);
    if(a!==n){ var nh=document.createElement('h'+a); for(var i=0;i<h.attributes.length;i++) nh.setAttribute(h.attributes[i].name,h.attributes[i].value); nh.setAttribute('data-vis','h'+n); while(h.firstChild) nh.appendChild(h.firstChild); h.parentNode.replaceChild(nh,h); n=a; }
    last=n; });
}
/* Scrollable tables must be reachable by keyboard. Also covers tables drawn later (compare, measured times). */
var _tblN=0;
function fixTables(root){ $$('.tbl:not([data-fx])',root).forEach(function(t){ var sec=t.closest('.sec'), h=sec&&$('h2',sec), card=t.closest('.card'), ch=card&&$('h3,h4,[data-vis]',card); var base=(ch?ch.textContent:(h?h.textContent:'Data')).trim().slice(0,50); t.setAttribute('data-fx','1'); t.setAttribute('tabindex','0'); t.setAttribute('role','region'); t.setAttribute('aria-label','Table '+(++_tblN)+': '+base+'. Scroll sideways if it does not fit.'); }); }
function show(name){
  var v=VIEWS.filter(function(x){return x[0]===name;})[0]||VIEWS[0]; name=v[0];
  VIEWS.forEach(function(x){ document.getElementById('v-'+x[0]).hidden=(x[0]!==name); });
  $$('[data-tab]').forEach(function(a){ if(a.getAttribute('data-tab')===name) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  var root=document.getElementById('v-'+name);
  if(!_built[name]){ root.innerHTML=v[2](); fixHeadings(root); _built[name]=1; try{ v[3](root); }catch(e){ console.error('bind '+name,e); } }
  document.title='EV Raasta · '+v[1];
}
function route(){ var h=(location.hash||'').replace('#',''); show(h); if(!_first) { _first=1; } else { window.scrollTo(0,0); var m=document.getElementById('main'); if(m) try{ m.focus({preventScroll:true}); }catch(e){} } }
var _first=0;
function effectiveTheme(){ var t=document.documentElement.getAttribute('data-theme'); if(t) return t; return (window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'; }
function applyTheme(t){ if(t==='dark'||t==='light') document.documentElement.setAttribute('data-theme',t); else document.documentElement.removeAttribute('data-theme');
  var m=document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute('content', effectiveTheme()==='dark'?'#0B6B4B':'#0A6B4B'); }
function updateFavCount(){ var n=document.getElementById('favcount'); if(n) n.textContent=(typeof CS!=='undefined'?CS.fav.length:0); }
function initApp(){
  var saved=store('theme'); if(saved==='dark'||saved==='light') applyTheme(saved);
  buildShell(); tipInit(); updateFavCount();
  if(window.MutationObserver){ new MutationObserver(function(){ fixTables(document); }).observe(document.getElementById('app'),{childList:true,subtree:true}); }
  document.getElementById('themebtn').addEventListener('click',function(){ var n=effectiveTheme()==='dark'?'light':'dark'; applyTheme(n); store('theme',n); });
  document.getElementById('favlink').addEventListener('click',function(){ if(location.hash!=='#cars') location.hash='cars'; else show('cars'); var go=function(){ var b=document.getElementById('x-fav'); if(b&&!CS.favOnly) b.click(); var el=document.getElementById('cars-all'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }; setTimeout(go,60); });
  document.addEventListener('favchange',updateFavCount);
  document.addEventListener('click',function(e){
    var sk=e.target.closest('[data-skip]'); if(sk){ e.preventDefault(); var mm=document.getElementById('main'); if(mm){ mm.focus(); } return; }
    var j=e.target.closest('[data-jump]'); if(j){ var el=document.getElementById(j.getAttribute('data-jump')); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); return; }
    var g=e.target.closest('[data-go]'); if(g){ var t=g.getAttribute('data-go'); if(location.hash==='#'+t) window.scrollTo(0,0); else location.hash=t; }
  });
  /* printing: open every checklist and answer so nothing is hidden on paper, then put them back */
  var _po=[]; window.addEventListener('beforeprint',function(){ _po=[]; $$('details').forEach(function(d){ if(!d.open){ d.open=true; _po.push(d); } }); }); window.addEventListener('afterprint',function(){ _po.forEach(function(d){ d.open=false; }); _po=[]; });
  window.addEventListener('hashchange',route); route();
}
initApp();
