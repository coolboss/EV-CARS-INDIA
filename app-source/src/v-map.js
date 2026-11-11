/* ===== MAP tab: schematic India map, corridors, route planner ===== */
var MS={sel:null,route:null};
var LIVE_EMBED=__LIVE_EMBED__;
function liveLinks(n){
  var q=n?('/@'+n.la+','+n.lo+',12z'):'';
  return '<div class="row" style="gap:8px">'+
   '<a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/EV+charging+station'+q+'">Google Maps: chargers</a>'+
   '<a class="btn sm" target="_blank" rel="noopener" href="https://www.plugshare.com/">PlugShare</a>'+
   '<a class="btn sm" target="_blank" rel="noopener" href="https://www.statiq.in/">Statiq</a>'+
   '<a class="btn sm" target="_blank" rel="noopener" href="https://e-amrit.niti.gov.in/">e-AMRIT</a></div>';
}
function mapSvg(){
  var out='<svg class="map" id="indmap" viewBox="0 0 '+MAP_W+' '+MAP_H+'" role="group" aria-label="Schematic map of India with main highway corridors and charging stops. Cities are buttons.">';
  out+='<g>'+INDIA_PATHS.map(function(p){return '<path class="st" d="'+p.d+'"><title>'+esc(p.n)+'</title></path>';}).join('')+'</g><g>';
  EDGES.forEach(function(e){ var a=NODES[e[0]],b=NODES[e[1]]; if(!a||!b) return; var A=mapXY(a.la,a.lo),B=mapXY(b.la,b.lo);
    out+='<line class="edge'+(e[2].indexOf('partly')>-1?' dash':'')+'" x1="'+A[0].toFixed(1)+'" y1="'+A[1].toFixed(1)+'" x2="'+B[0].toFixed(1)+'" y2="'+B[1].toFixed(1)+'"/>'; });
  out+='</g><g id="routeg"></g><g>';
  Object.keys(NODES).forEach(function(k){ var n=NODES[k], P=mapXY(n.la,n.lo), hub=n.t==='hub';
    out+='<g data-node="'+k+'" tabindex="0" role="button" aria-label="'+esc(n.nm)+'" style="cursor:pointer"><circle cx="'+P[0].toFixed(1)+'" cy="'+P[1].toFixed(1)+'" r="13" fill="transparent"/><circle class="dot'+(hub?' hub':'')+(n.tesla?' tesla':'')+'" id="dot-'+k+'" cx="'+P[0].toFixed(1)+'" cy="'+P[1].toFixed(1)+'" r="'+(hub?5.5:3.8)+'"/></g>';
    if(hub) out+='<text class="lab" x="'+(P[0]+8).toFixed(1)+'" y="'+(P[1]+4).toFixed(1)+'">'+esc(n.nm)+'</text>'; });
  out+='</g><g id="selg"></g></svg>';
  return out;
}
function viewMap(){
  var opts=Object.keys(NODES).sort(function(a,b){return NODES[a].nm<NODES[b].nm?-1:1;}).map(function(k){return {k:k,n:NODES[k].nm};});
  function sel(id,def){return '<select id="'+id+'">'+opts.map(function(o){return '<option value="'+o.k+'"'+(o.k===def?' selected':'')+'>'+esc(o.n)+'</option>';}).join('')+'</select>';}
  return ''+
  '<div class="intro"><div><div class="kicker">Highways, stops and a trip planner</div><h1>Charging map</h1></div>'+
  '<p class="lead">Tap any city to see what is known about charging there. Or plan a trip: pick your car and the planner shows where to stop.</p></div>'+
  note('info','Read this first','<p>This is a simple map, not a live one. It shows the main routes and where charging is known. Real charger locations and working status change every week, so always check a live map or app (links are under each city).</p>')+
  '<section class="sec" id="mp-map" style="margin-top:18px">'+
  '<div class="cols2 mapcols"><div><div class="mapbox">'+mapSvg()+'</div>'+
   '<div class="maplegend"><span><svg width="16" height="16"><circle cx="8" cy="8" r="5.5" fill="var(--ink)"/></svg>Big city</span><span><svg width="16" height="16"><circle cx="8" cy="8" r="4" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.6"/></svg>Highway stop</span><span><svg width="16" height="16"><circle cx="8" cy="8" r="4" fill="var(--surface)" stroke="var(--route)" stroke-width="2"/></svg>Tesla chargers (owners only)</span><span><svg width="26" height="10"><line x1="1" y1="5" x2="25" y2="5" stroke="var(--ink2)" stroke-width="1.8" opacity=".6"/></svg>Main highway</span><span><svg width="26" height="10"><line x1="1" y1="5" x2="25" y2="5" stroke="var(--ink2)" stroke-width="1.8" stroke-dasharray="4 3" opacity=".7"/></svg>Expressway, partly open</span></div></div>'+
  '<div class="stack" style="align-self:start"><div class="card stack" id="nodecard" aria-live="polite"><h3>Pick a place</h3><p class="small muted" style="margin:0">Tap a dot on the map. You will see what the sources say about charging there, plus links to live maps.</p></div>'+
  '<div class="card stack"><h3>Planning a trip?</h3><p class="small" style="margin:0">Use the planner below. It picks the road, estimates stops, and shows each stop on the map.</p><button class="btn" data-jump="mp-plan">Open the planner</button></div></div></div></section>'+

  '<section class="sec" id="mp-live">'+secHead('','Live chargers','Find chargers near you','Search any city or area. The map is Google Maps, so it shows current listings, but it cannot promise a charger is working or free. Always check the charger’s own app too.')+
  '<div class="card stack"><div class="row" style="gap:8px;flex-wrap:wrap"><div class="field" style="flex:1 1 220px"><label for="lv-q">City or area</label><input type="search" id="lv-q" placeholder="For example Vadodara" autocomplete="off"></div><button class="btn pri" id="lv-go" style="align-self:end">Search chargers</button><button class="btn" id="lv-loc" style="align-self:end">Use my location</button></div>'+
  '<div class="row" id="lv-chips" style="gap:6px">'+['Vadodara','Ahmedabad','Mumbai','Delhi NCR','Bengaluru','Pune','Jaipur','Chennai','Hyderabad','Kolkata'].map(function(c){return '<button class="chip" data-city="'+c+'">'+c+'</button>';}).join('')+'</div>'+
  '<div id="lv-msg" class="small muted" aria-live="polite"></div>'+
  '<div id="lv-box" class="liveph"><div><p class="small" style="margin:0 0 10px;max-width:46ch">Pick a city or tap a button above. The map loads from Google when you do, which shares your visit with Google.</p></div></div>'+
  '<div class="row" style="gap:8px" id="lv-links"></div></div></section>'+
  '<section class="sec" id="mp-plan">'+secHead('','Trip planner','Plan a highway trip','A rough plan, not a promise. It assumes you charge from 10% to 80% at each stop and drive at about 75 km/h on average. It cannot know if a charger is working, so confirm on an app before you leave.')+
  '<div class="card"><div class="fgrid">'+
   '<div class="field"><label for="p-from">From</label>'+sel('p-from','delhi')+'</div>'+
   '<div class="field"><label for="p-to">To</label>'+sel('p-to','jaipur')+'</div>'+
   '<div class="field"><label for="p-car">Car</label><select id="p-car">'+carOptions(function(c){return c.re&&c.dc;},'creta')+'</select></div>'+
   '<div class="field"><div class="lab">Starting charge</div><div class="val" id="p-sv"></div><input type="range" id="p-s" min="30" max="100" step="5" value="90" aria-label="Starting charge percent"></div>'+
   '<div class="field"><div class="lab">Highway range, share of tested range</div><div class="val" id="p-fv"></div><input type="range" id="p-f" min="65" max="100" step="5" value="85" aria-label="Highway range factor"></div>'+
   '<div class="field"><label for="p-kw">Fast charger power</label><select id="p-kw"><option value="30">30 kW</option><option value="60">60 kW</option><option value="120" selected>120 kW</option><option value="180">180 kW</option><option value="240">240 kW</option></select></div>'+
   '<div class="field"><label for="p-t">Fast charge price (₹ per kWh)</label><input type="number" id="p-t" value="24" min="10" max="40" step="1"></div>'+
  '</div><div class="row" style="margin-top:14px"><button class="btn ghost sm" id="p-swap">Swap start and end</button></div></div>'+
  '<div id="p-out" class="stack" style="margin-top:14px" aria-live="polite"></div></section>'+

  '<section class="sec" id="mp-stats">'+secHead('','The big picture','India’s charging network in numbers','Official figures from the government’s own data and news reports.')+
  '<div class="grid">'+[
   ['27,737','public charging stations installed (March 2026)'],
   ['22,753','of them working (about 82%)'],
   ['235 EVs','for every public charging station, on average'],
   ['91%','of national highway stretches have a charger about every 50 km, say officials'],
   ['4,874','more chargers approved in July 2026'],
   ['PM E-DRIVE','the central scheme paying for more public chargers']
  ].map(function(s){return '<div class="card stat"><div class="v">'+s[0]+'</div><div class="l" style="letter-spacing:.04em;text-transform:none;font-size:15px;font-weight:500;font-family:var(--font-b);color:var(--ink2)">'+s[1]+'</div></div>';}).join('')+'</div>'+
  note('warn','Numbers differ','<p>Another tracker counts about 52,700 stations. It counts differently (points, not sites). The official number is safer to quote. Also: stations are heavy in a few big states. Many smaller towns still have none, so plan before you go.</p>')+'</section>';
}
function bindMap(){
  var mapEl=$('#indmap');
  function nodeCard(k){
    var n=NODES[k]; MS.sel=k;
    $('#selg').innerHTML=(function(){var P=mapXY(n.la,n.lo); return '<circle cx="'+P[0]+'" cy="'+P[1]+'" r="11" fill="none" stroke="var(--route)" stroke-width="3"/><text class="lab" x="'+(P[0]+14)+'" y="'+(P[1]+4)+'">'+esc(n.nm)+'</text>';})();
    $('#nodecard').innerHTML='<div class="row" style="justify-content:space-between"><h3>'+esc(n.nm)+'</h3>'+(n.t==='hub'?pill('info','Big city'):pill('','Highway stop'))+(n.tesla?pill('good','Tesla chargers'):'')+'</div>'+
      (n.n?'<p class="small" style="margin:0">'+esc(n.n)+'</p>':'<p class="small muted" style="margin:0">No reliable detail found in my sources. Open a live map below.</p>')+
      '<div class="row" style="gap:6px"><button class="btn sm" data-from="'+k+'">Plan from here</button><button class="btn sm ghost" data-to="'+k+'">Plan to here</button>'+(LIVE_EMBED?'<button class="btn sm ghost" data-live="'+esc(n.nm)+'">Show chargers on live map</button>':'')+'</div>'+liveLinks(n);
  }
  mapEl.addEventListener('click',function(e){ var g=e.target.closest('[data-node]'); if(g) nodeCard(g.getAttribute('data-node')); });
  mapEl.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ var g=e.target.closest('[data-node]'); if(g){ e.preventDefault(); nodeCard(g.getAttribute('data-node')); } } });
  $('#nodecard').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return;
    if(b.getAttribute('data-live')){ liveSearch(b.getAttribute('data-live')); var le=document.getElementById('mp-live'); if(le) le.scrollIntoView({behavior:'smooth',block:'start'}); return; }
    if(b.getAttribute('data-from')) $('#p-from').value=b.getAttribute('data-from'); if(b.getAttribute('data-to')) $('#p-to').value=b.getAttribute('data-to'); plan(); var el=document.getElementById('mp-plan'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); });
  /* live map (Google Maps embed, loads only after the user asks) */
  function gmUrl(q,embed){ return 'https://maps.google.com/maps?q='+encodeURIComponent('EV charging stations near '+q)+'&z=11'+(embed?'&output=embed':''); }
  function liveSearch(q){
    q=String(q||'').trim().slice(0,120); if(!q){ $('#lv-msg').textContent='Type a city or area first.'; return; }
    $('#lv-q').value=q; $('#lv-msg').textContent='Showing chargers near '+q+'.';
    var box=$('#lv-box');
    if(LIVE_EMBED){ box.className=''; box.innerHTML=''; var f=document.createElement('iframe'); f.className='livemap'; f.title='Google Maps: EV charging stations near '+q; f.loading='lazy'; f.referrerPolicy='no-referrer'; f.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups'); f.src=gmUrl(q,true); box.appendChild(f); }
    else { box.className='liveph'; box.innerHTML='<div><p class="small" style="margin:0 0 10px;max-width:46ch">The embedded map is switched off in this view. Open it in Google Maps instead.</p><a class="btn pri" target="_blank" rel="noopener noreferrer" href="'+gmUrl(q,false)+'">Open Google Maps for '+esc(q)+'</a></div>'; }
    $('#lv-links').innerHTML='<a class="btn sm" target="_blank" rel="noopener noreferrer" href="'+gmUrl(q,false)+'">Open full map</a><a class="btn sm" target="_blank" rel="noopener noreferrer" href="https://www.plugshare.com/">PlugShare</a><a class="btn sm" target="_blank" rel="noopener noreferrer" href="https://evyatra.beeindia.gov.in/">BEE EV Yatra (government)</a>';
    $$('#lv-chips .chip').forEach(function(c){ c.setAttribute('aria-pressed',c.getAttribute('data-city')===q); });
  }
  window.liveSearch=liveSearch;
  $('#lv-go').addEventListener('click',function(){ liveSearch($('#lv-q').value); });
  $('#lv-q').addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); liveSearch($('#lv-q').value); } });
  $('#lv-chips').addEventListener('click',function(e){ var b=e.target.closest('[data-city]'); if(b) liveSearch(b.getAttribute('data-city')); });
  $('#lv-loc').addEventListener('click',function(){
    var msg=$('#lv-msg'); if(!navigator.geolocation){ msg.textContent='Your browser cannot share your location. Type a city instead.'; return; }
    msg.textContent='Asking your device for your location…';
    try{ navigator.geolocation.getCurrentPosition(function(pos){ liveSearch(pos.coords.latitude.toFixed(4)+','+pos.coords.longitude.toFixed(4)); $('#lv-q').value=''; msg.textContent='Showing chargers near your location.'; },function(){ msg.textContent='Location was not shared. Type a city instead.'; },{timeout:10000,maximumAge:600000}); }catch(e){ msg.textContent='Location is not available here. Type a city instead.'; }
  });
  function plan(){
    var a=$('#p-from').value, b=$('#p-to').value, c=carById($('#p-car').value), s=num('p-s',90), f=num('p-f',85);
    $('#p-sv').textContent=s+'%'; $('#p-fv').textContent=f+'%';
    var rg=$('#routeg'); rg.innerHTML=''; var out=$('#p-out');
    if(a===b){ out.innerHTML=note('warn','Pick two places','<p>Start and end are the same.</p>'); return; }
    var r=shortestPath(a,b); if(!r){ out.innerHTML=note('warn','No road found','<p>This map has no connection between these two places.</p>'); return; }
    var t=tripPlan({car:c,km:r.km,startPct:s,factor:f/100,chargerKw:num('p-kw',120),tariff:num('p-t',24)});
    if(!t.ok){ out.innerHTML=note('warn','Not possible','<p>This car cannot fast charge, so it is not suited for highway trips.</p>'); return; }
    var pts=r.nodes.map(function(k){var P=mapXY(NODES[k].la,NODES[k].lo); return P[0].toFixed(1)+','+P[1].toFixed(1);}).join(' ');
    var svg='<polyline class="route" points="'+pts+'"/>';
    var stops=[]; for (var i=0;i<t.stops;i++){ var d=Math.min(r.km-5,t.leg1+i*t.usable); var p=pointAlong(r,d); stops.push({d:d,p:p}); var P=mapXY(p.la,p.lo); svg+='<circle class="stop" cx="'+P[0].toFixed(1)+'" cy="'+P[1].toFixed(1)+'" r="9"/><text class="stoplab" x="'+P[0].toFixed(1)+'" y="'+(P[1]+4).toFixed(1)+'">'+(i+1)+'</text>'; }
    [a,b].forEach(function(k,ix){ var P=mapXY(NODES[k].la,NODES[k].lo); svg+='<circle cx="'+P[0].toFixed(1)+'" cy="'+P[1].toFixed(1)+'" r="7" fill="var(--route)" stroke="var(--surface)" stroke-width="2"/><text class="lab" x="'+(P[0]+10).toFixed(1)+'" y="'+(P[1]-8).toFixed(1)+'">'+(ix?'End: ':'Start: ')+esc(NODES[k].nm)+'</text>'; });
    rg.innerHTML=svg;
    var roads=[]; r.segs.forEach(function(sg){ if(roads[roads.length-1]!==sg.name) roads.push(sg.name); });
    var h='<div class="card stack"><div class="row" style="gap:22px">'+
      '<div class="stat"><div class="v">'+Math.round(r.km)+' km</div><div class="l">Distance (estimate)</div></div>'+
      '<div class="stat"><div class="v">'+(t.stops?t.stops:'None')+'</div><div class="l">Fast-charge stops</div></div>'+
      '<div class="stat"><div class="v">'+fmtDur(t.totalMin)+'</div><div class="l">Total time</div></div>'+
      '<div class="stat"><div class="v">'+(t.stops?fmtRs(t.dcCost):'—')+'</div><div class="l">Fast charge cost</div></div></div>'+
      '<p class="small muted" style="margin:0">Road: '+esc(roads.join(' → '))+'. Highway range for this car: about '+Math.round(t.real)+' km (full), '+Math.round(t.usable)+' km between 80% and 10%.</p></div>';
    if(!t.stops) h+=note('good','No stop needed','<p>You can drive this on one charge and still arrive with about 10% left. Carry a portable charger, and top up if you can at the other end.</p>');
    else {
      h+='<div class="card"><h3 data-vis="h4" style="margin-bottom:8px">Your stops</h3><ol class="steps">'+stops.map(function(sp,i){ var near=sp.p.near;
        return '<li><div class="stone" aria-hidden="true"><i></i><b>'+(i+1)+'</b></div><div><b>Around km '+Math.round(sp.d)+', near '+esc(near)+'</b><div class="small muted">'+esc(sp.p.corridor)+'. Charge 10→80%: about '+fmtDur(t.perStopMin)+' plus plug-in time. Find an exact charger on the app, and look for a second option nearby.</div></div></li>'; }).join('')+'</ol></div>';
      if(t.perStopMin>50) h+=note('info','Slow charging car','<p>This car needs '+fmtDur(t.perStopMin)+' per stop. A faster charger will not help much because the car sets the pace.</p>');
    }
    h+=note('warn','Check before you go','<p>Distances are estimates from straight lines. Charger working status changes daily. Open the live map for each stop, and have a backup within 30 km.</p>')+'<div class="card stack"><h3 data-vis="h4">See live chargers</h3>'+liveLinks(NODES[a])+'</div>';
    out.innerHTML=h;
  }
  ['p-from','p-to','p-car','p-s','p-f','p-kw','p-t'].forEach(function(id){ document.getElementById(id).addEventListener('input',plan); });
  $('#p-swap').addEventListener('click',function(){ var x=$('#p-from').value; $('#p-from').value=$('#p-to').value; $('#p-to').value=x; plan(); });
  plan();
}
