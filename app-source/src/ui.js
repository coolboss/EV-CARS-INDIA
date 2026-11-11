/* ===== UI helpers: DOM shortcuts, tooltip, saved state, charts ===== */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function num(id,fallback){var e=document.getElementById(id); var v=e?parseFloat(e.value):NaN; return isFinite(v)?v:fallback;}
function store(k,v){ try{ if(v===undefined){ var r=localStorage.getItem('evr_'+k); return r?JSON.parse(r):null; } localStorage.setItem('evr_'+k,JSON.stringify(v)); }catch(e){ return null; } }
function carOptions(filter,sel){
  return CARS.filter(filter||function(){return true;}).map(function(c){return '<option value="'+c.id+'"'+(c.id===sel?' selected':'')+'>'+esc(c.br+' '+c.nm)+' ('+c.bats.split(' (')[0]+' kWh)</option>';}).join('');
}
function note(kind,label,html){return '<div class="note '+kind+'"><span class="lbl">'+label+'</span>'+html+'</div>';}
function pill(kind,t){return '<span class="pill '+kind+'">'+t+'</span>';}
function secHead(id,kicker,title,sub){return '<header><div class="kicker">'+kicker+'</div><h2>'+title+'</h2>'+(sub?'<p>'+sub+'</p>':'')+'</header>';}

/* ---- tooltip (hover, focus and tap) ---- */
var _tip=null;
function tipInit(){
  _tip=document.createElement('div'); _tip.className='tip'; _tip.setAttribute('role','status'); document.body.appendChild(_tip);
  function show(t,x,y){ _tip.innerHTML=t; _tip.classList.add('on'); var w=_tip.offsetWidth,h=_tip.offsetHeight; var L=Math.min(Math.max(8,x+14),window.innerWidth-w-8), T=y+16+h>window.innerHeight?y-h-12:y+16; _tip.style.left=L+'px'; _tip.style.top=T+'px'; }
  document.addEventListener('pointermove',function(e){ var t=e.target.closest&&e.target.closest('[data-tip]'); if(t) show(t.getAttribute('data-tip'),e.clientX,e.clientY); else _tip.classList.remove('on'); });
  document.addEventListener('pointerdown',function(e){ var t=e.target.closest&&e.target.closest('[data-tip]'); if(t) show(t.getAttribute('data-tip'),e.clientX,e.clientY); });
  document.addEventListener('scroll',function(){_tip.classList.remove('on');},true);
}
function showTip(html,x,y){ if(!_tip) return; _tip.innerHTML=html; _tip.classList.add('on'); var w=_tip.offsetWidth,h=_tip.offsetHeight; _tip.style.left=Math.min(Math.max(8,x+14),window.innerWidth-w-8)+'px'; _tip.style.top=(y+16+h>window.innerHeight?y-h-12:y+16)+'px'; }
function hideTip(){ if(_tip) _tip.classList.remove('on'); }

/* ---- grouped horizontal bars: claimed (soft) vs tested (solid). rows: [{label, a, b, kind, tipA, tipB}] ---- */
function rangeChart(rows,max){
  var W=640, L=148, R=46, rh=30, H=rows.length*rh+30, iw=W-L-R, out='<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Claimed range versus tested range for '+rows.length+' cars">';
  for (var t=0;t<=max;t+=100){ var x=L+iw*t/max; out+='<line class="grid" x1="'+x+'" x2="'+x+'" y1="6" y2="'+(H-24)+'"/><text x="'+x+'" y="'+(H-8)+'" text-anchor="middle">'+t+'</text>'; }
  out+='<text x="'+(L+iw)+'" y="'+(H-8)+'" text-anchor="end" style="font-size:11px">km</text>';
  rows.forEach(function(r,i){
    var y=10+i*rh, wa=iw*r.a/max, wb=iw*r.b/max;
    out+='<text class="t1" x="'+(L-8)+'" y="'+(y+14)+'" text-anchor="end">'+esc(r.label)+'</text>';
    out+='<rect x="'+L+'" y="'+y+'" width="'+wa+'" height="9" rx="3" fill="var(--s1-soft)" data-tip="'+esc(r.tipA)+'"/>';
    out+='<rect x="'+L+'" y="'+(y+11)+'" width="'+wb+'" height="9" rx="3" fill="var(--s1)" data-tip="'+esc(r.tipB)+'"/>';
    out+='<text x="'+(L+wb+5)+'" y="'+(y+20)+'" style="font-size:11.5px" class="t1">'+r.b+'</text>';
  });
  return out+'</svg>';
}

/* ---- two-line chart over years with crosshair. series: [{name,color,f(y)}]  y in rupees, shown as lakh ---- */
function lineChart(id,series,maxY,yMax){
  var W=640,H=300,L=46,R=14,T=12,B=34,iw=W-L-R,ih=H-T-B, hi=0;
  for (var y=0;y<=maxY;y+=0.25) series.forEach(function(s){hi=Math.max(hi,s.f(y));});
  var top=Math.ceil(hi/1e5/ (hi>4e6?5:2))*(hi>4e6?5:2)*1e5; if(yMax) top=yMax;
  function X(y){return L+iw*y/maxY;} function Y(v){return T+ih-ih*v/top;}
  var out='<svg class="chart" id="'+id+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Cumulative cash paid over the years: own versus battery rental">';
  var step=top/1e5>40?10:top/1e5>16?5:2;
  for (var g=0; g<=top/1e5; g+=step){ var yy=Y(g*1e5); out+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'"/><text x="'+(L-6)+'" y="'+(yy+4)+'" text-anchor="end">'+g+'</text>'; }
  for (var k=0;k<=maxY;k+=1){ out+='<text x="'+X(k)+'" y="'+(H-12)+'" text-anchor="middle">'+k+'</text>'; }
  out+='<text x="'+L+'" y="9" style="font-size:11px">₹ lakh paid in total</text><text x="'+(W-R)+'" y="'+(H-1)+'" text-anchor="end" style="font-size:11px">years of ownership</text>';
  series.forEach(function(s){
    var d=''; for (var y=0;y<=maxY+0.001;y+=1/12){ d+=(d?'L':'M')+X(y).toFixed(1)+' '+Y(s.f(y)).toFixed(1); }
    out+='<path d="'+d+'" fill="none" stroke="'+s.color+'" stroke-width="2.5" stroke-linejoin="round"/>';
    var ye=s.f(maxY); out+='<circle cx="'+X(maxY)+'" cy="'+Y(ye)+'" r="4.5" fill="'+s.color+'" stroke="var(--surface)" stroke-width="2"/>';
  });
  out+='<line id="'+id+'-x" class="axis" y1="'+T+'" y2="'+(T+ih)+'" x1="-9" x2="-9" style="stroke:var(--ink2)"/>';
  out+='<rect id="'+id+'-hit" x="'+L+'" y="'+T+'" width="'+iw+'" height="'+ih+'" fill="transparent"/></svg>';
  return {svg:out, bind:function(){
    var svg=document.getElementById(id), hit=document.getElementById(id+'-hit'), xl=document.getElementById(id+'-x'); if(!svg||!hit) return;
    function move(e){ var r=svg.getBoundingClientRect(), px=(e.clientX-r.left)/r.width*W; var y=Math.round(Math.max(0,Math.min(maxY,(px-L)/iw*maxY))*4)/4;
      xl.setAttribute('x1',X(y)); xl.setAttribute('x2',X(y));
      showTip('<b>Year '+y+'</b><br>'+series.map(function(s){return s.name+': ₹'+(s.f(y)/1e5).toFixed(2)+' L';}).join('<br>'),e.clientX,e.clientY); }
    hit.addEventListener('pointermove',move); hit.addEventListener('pointerdown',move);
    hit.addEventListener('pointerleave',function(){ xl.setAttribute('x1',-9); xl.setAttribute('x2',-9); hideTip(); });
  }};
}

/* ---- navigation icons ---- */
var ICONS={
 learn:'<svg viewBox="0 0 24 24"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5C4.7 19 4 18.3 4 17.5z"/><path d="M20 5.5C20 4.7 19.3 4 18.5 4H13v15h5.5c.8 0 1.5-.7 1.5-1.5z"/></svg>',
 cars:'<svg viewBox="0 0 24 24"><path d="M4 15v-3l2-5h12l2 5v3"/><path d="M3 15h18v3H3z"/><circle cx="7.5" cy="18" r="1.4"/><circle cx="16.5" cy="18" r="1.4"/></svg>',
 charging:'<svg viewBox="0 0 24 24"><path d="M13 3 6 13h5l-1 8 7-10h-5z"/></svg>',
 map:'<svg viewBox="0 0 24 24"><path d="M12 21s-6-5.6-6-10a6 6 0 1 1 12 0c0 4.4-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>',
 money:'<svg viewBox="0 0 24 24"><path d="M7 5h10M7 9h10M9 5c4 0 5 2 5 3.5S13 12 9 12h-1l7 7"/></svg>',
 buy:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4 4L19 7"/><rect x="3.5" y="3.5" width="17" height="17" rx="3"/></svg>'
};
