/* ===== CARS tab ===== */
var CS={fast:'any',tariff:8, cmp:[], fav:[], favOnly:false, open:{}, classes:[], body:'all', seats:'any', sort:'price', q:'', budgetIdx:15};
function loadCarState(){ ['cmp','fav'].forEach(function(k){ var v=store(k); CS[k]=Array.isArray(v)?v.filter(function(id,i,a){return typeof id==='string'&&carById(id)&&a.indexOf(id)===i;}).slice(0,k==='cmp'?3:200):[]; }); }
loadCarState();
var BUDGETS=[8,10,12,15,18,20,25,30,40,50,60,80,100,150,300,1000];
var BODYGROUP={all:'All body types',small:'Small and hatchback',sedan:'Sedan and coupe',suv:'SUV and crossover',mpv:'MPV and 7-seat'};
function bodyGroup(c){ var b=c.body; if(/Micro|Hatch/.test(b)) return 'small'; if(/Sedan|Coupe|Roadster/.test(b)) return 'sedan'; if(/MPV/.test(b)||c.seats>=6) return 'mpv'; return 'suv'; }

function styleBars(c){
  if(!c.rs) return '<span class="muted">'+(c.rk==='T'?'The test published only one blended figure.':'No split available. This is an estimate.')+'</span>';
  var top=Math.max(c.cl||0,c.rs[0],c.rs[1],c.re), rows=[['City loop',c.rs[0]],['Blend (tested)',c.re],['Highway loop',c.rs[1]]];
  return '<div class="sb">'+rows.map(function(r,i){return '<div class="sbr"'+(i===1?' style="font-weight:700"':'')+'><span>'+r[0]+'</span><span class="num">'+r[1]+' km</span><div class="bar"><i style="width:'+Math.round(r[1]/top*100)+'%"></i></div></div>';}).join('')+'</div><span class="muted small" style="display:block;margin-top:6px">Bars compare with the claimed range ('+c.cl+' km). City loop: stop-go with strong regen. Highway loop: steadier. Test speeds were not published.'+(c.rsd?' Worked out from the test’s km per kWh.':'')+'</span>';
}
function carCard(c,o){
  o=o||{}; var cpk=costPerKm(c,CS.tariff), pct=c.re&&c.cl?Math.round(c.re/c.cl*100):null, max=Math.max(c.cl,c.re||0,1);
  var tested=c.re?'<b>'+c.re+'</b>':'<b>-</b>'; var open=!!CS.open[c.id];
  var oi=ownerInfo(c), fi=fastInfo(c), pills=[fi.has?pill('good','⚡ Fast charging · '+fi.short):pill('bad','No fast charging · AC only')]; if(/5★/.test(c.ncap)) pills.push(pill('good','5★ crash test'));
  if(/Lifetime|15 yr/.test(c.wr)) pills.push(pill('good','Long battery cover'));
  if(c.baas) pills.push(pill('info','Battery rental'));
  if(c.caution) pills.push(pill('bad','Range warning'));
  if(c.rk==='E') pills.push(pill('warn','Range estimated'));
  if(c.conf==='l') pills.push(pill('warn','Thin data'));
  var h='<article class="car'+(o.pick?' pick':'')+(open?' detail-open':'')+'" data-id="'+c.id+'">'+
   '<div class="row between" style="align-items:flex-start"><div style="min-width:0"><div class="br">'+esc(c.br)+(o.pick?' · '+o.pick:'')+'</div><h3 data-vis="h4">'+esc(c.nm)+'</h3></div><div style="text-align:right;display:flex;gap:8px;align-items:flex-start"><button class="heart" data-act="fav" data-id="'+c.id+'" aria-pressed="'+(CS.fav.indexOf(c.id)>-1)+'" aria-label="Save '+esc(c.br+' '+c.nm)+'" title="Save this car">'+(CS.fav.indexOf(c.id)>-1?'♥':'♡')+'</button><div><b class="num" style="font-size:16px">'+fmtPrice(c).replace(' to ','–')+'</b><div class="tiny muted">ex-showroom</div></div></div></div>'+
   '<div class="facts"><div><b>'+c.bat+'</b><span>kWh</span></div><div>'+tested+'<span>km '+(c.rk==='T'?'tested':c.rk==='E'?'est.':'range')+'</span></div><div><b>'+(cpk?'₹'+cpk.toFixed(2):'-')+'</b><span>per km</span></div></div>'+
   '<div class="own small">'+(oi?(oi.lvl==='toofew'?'<span class="muted">Owner rating: only '+oi.n+' rating'+(oi.n>1?'s':'')+' so far. Too few to judge.</span>':''+stars(oi.r)+' <b class="num">'+oi.r.toFixed(1)+'</b> <span class="muted">owner rating · '+oi.n+' ratings'+(oi.lvl==='few'?' (few)':'')+'</span><span class="sr"> '+oi.r.toFixed(1)+' out of 5 stars from '+oi.n+' owner ratings</span>'):'<span class="muted">Owner rating: none found yet</span>')+'</div>'+
   (c.re?'<div class="rangebar" data-tip="<b>'+esc(c.nm)+'</b><br>Claimed '+c.cl+' km · '+(c.rk==='T'?'tested ':'estimated ')+c.re+' km'+(pct?' ('+pct+'% of claim)':'')+'" role="img" aria-label="Claimed '+c.cl+' km, '+(c.rk==='T'?'tested':'estimated')+' '+c.re+' km"><i style="width:'+(c.cl/max*100)+'%"></i><i style="width:'+(c.re/max*100)+'%"></i></div>':'')+
   '<div class="row" style="gap:6px">'+pills.join('')+'</div>'+
   (o.why?'<ul class="small" style="margin:0;padding-left:18px">'+o.why.map(function(w){return '<li>'+w+'</li>';}).join('')+'</ul>':'')+
   '<div class="row between"><button class="btn sm" data-act="more" data-id="'+c.id+'" aria-expanded="'+open+'">'+(open?'Hide details':'Details')+'</button>'+
   '<label class="row small" style="gap:6px;cursor:pointer"><input type="checkbox" data-act="cmp" data-id="'+c.id+'"'+(CS.cmp.indexOf(c.id)>-1?' checked':'')+' style="width:18px;height:18px;accent-color:var(--info)"> Compare</label></div>'+
   '<div class="more"><dl>'+
    '<dt>Price</dt><dd>'+fmtPrice(c)+'</dd>'+
    '<dt>Battery</dt><dd>'+esc(c.bats)+' kWh · '+CLASS_LABEL[batClass(c.bat)]+'</dd>'+
    '<dt>Seats · body</dt><dd>'+c.seats+' · '+esc(c.body)+'</dd>'+
    '<dt>Claimed range</dt><dd>'+(c.cl?c.cl+' km':'not found')+'</dd>'+
    '<dt>Real range</dt><dd>'+(c.re?c.re+' km '+(c.rk==='T'?'(independent test)':'(estimate)'):'No reliable figure found')+(pct?' · '+pct+'% of claim':'')+'</dd>'+
    '<dt>By driving style</dt><dd>'+styleBars(c)+'</dd>'+
    '<dt>Range source</dt><dd>'+(c.src?'<a href="'+c.src+'" target="_blank" rel="noopener noreferrer">Independent test article (Autocar India)</a>':(c.rk==='T'?'Reader-supplied guide and press reports':c.rk==='E'?'Estimate from the claim and similar cars':'None found'))+'</dd>'+
    '<dt>Efficiency</dt><dd>'+(c.re?(c.re/c.bat).toFixed(1)+' km per kWh':'-')+'</dd>'+
    '<dt>Owner rating</dt><dd>'+(oi?oi.r.toFixed(1)+' out of 5 from '+oi.n+' ratings'+(oi.reviews?' and '+oi.reviews+' written reviews':'')+' on CarWale (read 11 Nov 2026). '+oi.lvlLabel+'. <a href="'+oi.url+'" target="_blank" rel="noopener noreferrer">See the ratings</a>':'None found on CarWale')+'</dd>'+
    '<dt>Fast charging</dt><dd>'+(c.dc?(c.meas?'about '+c.dc+' min for 10-80%. Measured: '+c.m[0]+' min for 20-80%'+(c.m[1]?', '+c.m[1]+' min for 80-100%':'')+' on a '+c.m[2]+' kW charger (Autocar India)':'about '+c.dc+' min for 10-80%'+(c.dce?' (class estimate)':' (maker or review figure, not measured)')):'No fast charging. This car can only charge on an AC charger (home, office or slow public)')+'</dd>'+
    '<dt>AC charging</dt><dd>up to '+c.ac+' kW (estimate; ask for the onboard charger rating)</dd>'+
    '<dt>Battery cover</dt><dd>'+esc(c.wr)+'</dd>'+
    '<dt>Safety</dt><dd>'+esc(c.ncap||'No crash-test result found')+'</dd>'+
    (c.baas?'<dt>Battery rental</dt><dd>'+fmtLakh(c.baas.price)+' car + ₹'+c.baas.perKm+'/km ('+(c.baas.type==='A'?'pay per km':'fixed 8-year battery loan')+', '+esc(c.baas.variant)+')</dd>':'')+
   '</dl><p class="small" style="margin:0">'+esc(c.note)+'</p></div></article>';
  return h;
}

function fastGlance(){
  var no=CARS.filter(function(c){return !fastInfo(c).has;}), yes=CARS.length-no.length, tiers={quick:[],mid:[],slow:[]};
  CARS.forEach(function(c){var f=fastInfo(c); if(f.has) tiers[f.tier].push(c);});
  function names(a){return a.sort(function(x,y){return x.dc-y.dc;}).map(function(c){return esc(c.br+' '+c.nm)+' <span class="muted">('+c.dc+' min)</span>';}).join(', ');}
  function tierCard(k,t,sub){var a=tiers[k]; return '<div class="card stack"><div class="stat"><div class="v">'+a.length+'</div><div class="l">'+t+'</div></div><p class="small muted" style="margin:0">'+sub+'</p><details><summary>See the cars</summary><p class="small" style="margin:8px 0 0">'+names(a)+'</p></details></div>';}
  return '<section class="sec" id="cars-fast">'+secHead('','Before you pick','Which cars can fast charge?','Fast charging means a DC fast charger on the highway. It is what makes a long trip possible. Every car below can use a home or slow charger. Only some can use a fast one.')+
   '<div class="grid w3" style="margin-bottom:14px">'+
    '<div class="card stack" style="border:2px solid var(--good)"><div class="stat"><div class="v">'+yes+' of '+CARS.length+'</div><div class="l">Can fast charge</div></div><p class="small" style="margin:0">Every car in this list except the two below. Look for the green “Fast charging” mark on each card.</p></div>'+
    '<div class="card stack" style="border:2px solid var(--bad);"><div class="stat"><div class="v">'+no.length+' cars</div><div class="l">Cannot fast charge</div></div><ul class="small" style="margin:0;padding-left:18px">'+no.map(function(c){return '<li><b>'+esc(c.br+' '+c.nm)+'</b>. '+(c.id==='comet'?'AC only. A city car. A trip beyond one charge needs hours at a slow charger.':'AC only. Small city car.')+'</li>';}).join('')+'</ul></div>'+
   '</div>'+
   '<h3 style="margin:18px 0 10px">How fast, for the cars that can</h3>'+
   '<div class="grid w3">'+tierCard('quick','Quick',"30 minutes or less for 10-80%")+tierCard('mid','Moderate','31 to 45 minutes for 10-80%')+tierCard('slow','Slower','Over 45 minutes for 10-80%')+'</div>'+
   note('warn','Check the exact variant','<p>Some makers sell the same model with and without a fast-charging socket, and older stock can differ. Ask the dealer to show you the DC fast-charging port (CCS2) on the exact variant you are buying. Times are for a 10-80% top-up on a strong charger, and many are estimates for that class of car. Open a card to see which are measured.</p>')+
  '</section>';
}
function ownerSection(){
  var rows=CARS.map(function(c){return {c:c,o:ownerInfo(c)};}).filter(function(x){return x.o&&x.o.n>=30;}).sort(function(a,b){return b.o.adj-a.o.adj;});
  var rated=CARS.filter(function(c){return c.ur;}).length, solid=rows.length;
  var body=rows.map(function(x,i){var o=x.o; return '<tr><td class="num">'+(i+1)+'</td><td><b>'+esc(x.c.br+' '+x.c.nm)+'</b></td><td>'+stars(o.r)+' <b class="num">'+o.r.toFixed(1)+'</b><span class="sr"> out of 5</span></td><td class="r num">'+o.n+'</td><td class="r num">'+o.reviews+'</td><td><a href="'+o.url+'" target="_blank" rel="noopener noreferrer">CarWale</a></td></tr>';}).join('');
  return '<section class="sec" id="cars-own">'+secHead('','What owners say','Owner star ratings','Star ratings from people who own or have driven these cars, from 1 (poor) to 5 (excellent). Ratings found for '+rated+' of '+CARS.length+' cars. The table lists the '+solid+' with 30 or more ratings.')+
   '<div class="tbl"><table><caption class="sr">Cars with 30 or more owner ratings, best first</caption><thead><tr><th scope="col">#</th><th scope="col">Car</th><th scope="col">Stars</th><th scope="col" class="r">Ratings</th><th scope="col" class="r">Written reviews</th><th scope="col">Source</th></tr></thead><tbody>'+body+'</tbody></table></div>'+
   note('warn','Read stars with care','<p>Almost every car scores 4 or more on review sites, so a difference of 0.1 or 0.2 means very little. Look at how many people rated: 4.7 from 380 owners means more than 5.0 from 2. The table is ordered with that in mind, so a high score from few ratings ranks lower. Early buyers tend to be fans, and a rating mixes every battery size and variant. Cars with fewer than 10 ratings show no stars on their card at all. Read a few written reviews, especially the low ones, to see what owners complain about.</p>')+
   note('info','Where the stars come from','<p>One source, so the cars can be compared fairly: the user ratings on each car’s CarWale page, read on 11 Nov 2026. They change daily. Every card links to its page. Other review sites are listed in the source library at the bottom of the Buy tab for you to cross-check.</p>')+
  '</section>';
}
function viewCars(){
  var picks=PICKS.map(function(p){
    var c=carById(p.id), c2=p.id2?carById(p.id2):null, cpk=costPerKm(c,8);
    return '<div class="card pickcard"><div><div class="band">'+p.band+'</div><div class="tiny muted">'+p.rng+'</div></div><h3>'+esc(c.br+' '+c.nm)+(c2?' <span class="muted" style="font-size:.7em">/ '+esc(c2.nm)+'</span>':'')+'</h3>'+
    '<div class="row" style="gap:16px"><div class="stat"><div class="v" style="font-size:22px">'+fmtLakh(c.p[0])+'</div><div class="l">from</div></div><div class="stat"><div class="v" style="font-size:22px">'+c.bat+'</div><div class="l">kWh</div></div>'+(c.re?'<div class="stat"><div class="v" style="font-size:22px">'+c.re+'</div><div class="l">km '+(c.rk==='T'?'tested':'est.')+'</div></div>':'')+(cpk?'<div class="stat"><div class="v" style="font-size:22px">₹'+cpk.toFixed(2)+'</div><div class="l">per km</div></div>':'')+'</div>'+
    '<p class="small" style="margin:0">'+p.why+'</p>'+
    '<div class="alts">'+p.alt.map(function(a){var x=carById(a[0]); return '<div><b>'+esc(x.br+' '+x.nm)+'</b> · '+a[1]+'</div>';}).join('')+'</div></div>';
  }).join('');
  return ''+
  '<div class="intro"><div><div class="kicker">'+CARS.length+' electric cars on sale · prices checked 10 Nov 2026</div><h1>Which electric car?</h1></div>'+
  '<p class="lead">One merged list built from a research report, two reader guides and an independent range-test review. Cars are grouped by battery size and price, with one clear pick in each group. Prices change often, so confirm with a dealer.</p></div>'+
  '<div class="jump">'+[['cars-fast','Fast charging'],['cars-picks','Best in each group'],['cars-find','Find my car'],['cars-all','All cars'],['cars-own','Owner ratings'],['cars-cmp','Compare'],['cars-warn','Watch out']].map(function(j){return '<button class="chip" data-jump="'+j[0]+'">'+j[1]+'</button>';}).join('')+'</div>'+

  fastGlance()+
  '<section class="sec" id="cars-picks">'+secHead('','Best in each group','My pick for every budget','Where the sources disagreed, the card says so. Tested range and safety counted for more than the brochure.')+'<div class="grid w3">'+picks+'</div>'+
  note('info','Why the Ioniq 5 and not the Model Y','<p>In independent tests the Hyundai Ioniq 5 went 501 km and the Tesla Model Y RWD went 370 km. The Ioniq 5 also charged 20-80% faster (16 min against 23 min on the chargers tested). The Model Y is still a good option for metro owners who value Tesla’s own charging network.</p>')+'</section>'+

  '<section class="sec" id="cars-find">'+secHead('','Quick shortlist','Find my car','Tell me four things. I will rank cars with a simple score: range for your needs, efficiency, value, safety, battery cover and charge speed. It is a starting list for test drives, not a verdict.')+
  '<div class="card"><div class="fgrid">'+
   '<div class="field"><div class="lab">Budget (ex-showroom)</div><div class="val" id="f-bv"></div><input type="range" id="f-b" min="0" max="'+(BUDGETS.length-1)+'" step="1" value="6" aria-label="Budget"></div>'+
   '<div class="field"><label for="f-s">Seats needed</label><select id="f-s"><option value="4">4 or 5 seats</option><option value="6">6 or 7 seats</option></select></div>'+
   '<div class="field"><div class="lab">Normal day</div><div class="val" id="f-dv"></div><input type="range" id="f-d" min="10" max="200" step="10" value="40" aria-label="Daily kilometres"></div>'+
   '<div class="field"><label for="f-t">Long trips (300+ km)</label><select id="f-t"><option value="0">Hardly ever</option><option value="1" selected>A few times a year</option><option value="4">About once a month</option><option value="8">Every week</option></select></div>'+
  '</div></div><div id="f-out" class="cars" style="margin-top:14px"></div></section>'+

  '<section class="sec" id="cars-all">'+secHead('','Every car','The full list','Filter, sort and open any card for the details. Tick “Compare” on up to three cars.')+
  '<div class="card" style="margin-bottom:14px"><div class="fgrid">'+
   '<div class="field"><label for="x-q">Search</label><input type="search" id="x-q" placeholder="Name or brand"></div>'+
   '<div class="field"><div class="lab">Budget up to</div><div class="val" id="x-bv"></div><input type="range" id="x-b" min="0" max="'+(BUDGETS.length-1)+'" step="1" value="'+CS.budgetIdx+'" aria-label="Budget limit"></div>'+
   '<div class="field"><label for="x-body">Body</label><select id="x-body">'+Object.keys(BODYGROUP).map(function(k){return '<option value="'+k+'">'+BODYGROUP[k]+'</option>';}).join('')+'</select></div>'+
   '<div class="field"><label for="x-seat">Seats</label><select id="x-seat"><option value="any">Any</option><option value="6">6 or more</option></select></div>'+
   '<div class="field"><label for="x-fast">Fast charging</label><select id="x-fast"><option value="any">Any</option><option value="yes">Can fast charge</option><option value="no">Cannot (AC only)</option></select></div>'+
   '<div class="field"><label for="x-sort">Sort by</label><select id="x-sort"><option value="price">Price, low to high</option><option value="range">Tested range, longest first</option><option value="eff">Efficiency, best first</option><option value="cost">Running cost, lowest first</option><option value="bat">Battery size, largest first</option><option value="dc">Fast charging, quickest first</option><option value="own">Owner rating, best first</option></select></div>'+
   '<div class="field"><label for="x-t">Home electricity ₹/kWh</label><input type="number" id="x-t" value="8" min="2" max="25" step="0.5"></div>'+
  '</div><div class="row" style="margin-top:12px" id="x-cls"><span class="small muted">Battery size:</span>'+Object.keys(CLASS_LABEL).map(function(k){return '<button class="chip" data-cls="'+k+'" aria-pressed="false">'+CLASS_LABEL[k]+'</button>';}).join('')+'<span class="small muted" style="margin-left:8px">Show:</span><button class="chip" id="x-fav" aria-pressed="false">♥ Saved cars (<span id="x-favn">0</span>)</button></div></div>'+
  '<div class="row between small" style="margin-bottom:10px"><span id="x-count" aria-live="polite"></span><span class="muted">Range: “tested” = independent test, “est.” = estimate</span></div>'+
  '<div class="cars" id="x-out"></div></section>'+

  ownerSection()+
  '<div class="cmpbar" id="cmpbar" hidden></div>'+
  '<section class="sec" id="cars-cmp">'+secHead('','Side by side','Compare cars','Tick “Compare” on up to three cars above. Green marks the best value in each row.')+'<div id="cmp-out"></div></section>'+

  '<section class="sec" id="cars-warn">'+secHead('','Be careful with these','Watch out','')+
  '<div class="grid">'+
   note('bad','MG M9','<p>Autocar’s data shows about 303 km tested against a 548 km claim. Think hard before using it for highway trips.</p>')+
   note('warn','Tata Tigor EV','<p>Tata has retired the Tigor name for the petrol car. Any EV you see is probably leftover stock. Ask about the new Tiago EV first.</p>')+
   note('warn','Vayve Eva','<p>Pre-bookings are shown as closed by the maker. Confirm you can actually buy one before planning around it.</p>')+
   note('warn','Brand-new launches','<p>The Mercedes GLC Electric launched on 4 Nov 2026. No long-term owner reports exist. Mercedes says orders cover supply to March 2027.</p>')+
  '</div></section>';
}

function budgetLabel(i){ var v=BUDGETS[i]; return v>=1000?'Any budget':'₹'+v+' lakh'; }

function bindCars(root){
  /* finder */
  function find(){
    var bi=num('f-b',6), need={budget:BUDGETS[bi],seats:num('f-s',4),dailyKm:num('f-d',40),trips:num('f-t',1)};
    $('#f-bv').textContent='Up to '+budgetLabel(bi); $('#f-dv').textContent=need.dailyKm+' km';
    var res=CARS.map(function(c){return scoreCar(c,need);}).filter(Boolean).sort(function(a,b){return b.score-a.score;}).slice(0,3);
    $('#f-out').innerHTML=res.length? res.map(function(r,i){return carCard(r.car,{why:r.why,pick:'#'+(i+1)+' match'});}).join('') : '<div class="note warn" style="grid-column:1/-1"><span class="lbl">No match</span><p>No car fits that budget and seat count with a known range. Raise the budget or relax the seats.</p></div>';
  }
  ['f-b','f-s','f-d','f-t'].forEach(function(id){ document.getElementById(id).addEventListener('input',find); }); find();
  /* explorer */
  function list(){
    CS.q=$('#x-q').value.trim().toLowerCase(); CS.budgetIdx=num('x-b',15); CS.body=$('#x-body').value; CS.seats=$('#x-seat').value; CS.fast=$('#x-fast').value; CS.sort=$('#x-sort').value; CS.tariff=num('x-t',8);
    $('#x-bv').textContent=budgetLabel(CS.budgetIdx); var lim=BUDGETS[CS.budgetIdx];
    var res=CARS.filter(function(c){
      if(c.p[0]>lim) return false; if(CS.classes.length&&CS.classes.indexOf(batClass(c.bat))<0) return false;
      if(CS.body!=='all'&&bodyGroup(c)!==CS.body) return false; if(CS.seats==='6'&&c.seats<6) return false; if(CS.fast==='yes'&&!c.dc) return false; if(CS.fast==='no'&&c.dc) return false;
      if(CS.q&&(c.br+' '+c.nm).toLowerCase().indexOf(CS.q)<0) return false; if(CS.favOnly&&CS.fav.indexOf(c.id)<0) return false; return true; });
    var by={price:function(a,b){return a.p[0]-b.p[0];},range:function(a,b){return (b.re||0)-(a.re||0);},eff:function(a,b){return (kmPerKwh(b)||0)-(kmPerKwh(a)||0);},
      cost:function(a,b){return (costPerKm(a,8)||99)-(costPerKm(b,8)||99);},bat:function(a,b){return b.bat-a.bat;},dc:function(a,b){return (a.dc||999)-(b.dc||999);},own:function(a,b){var x=ownerInfo(a),y=ownerInfo(b);return (y?y.adj:0)-(x?x.adj:0);}};
    res.sort(by[CS.sort]);
    var pickIds=PICKS.map(function(p){return p.id;}).concat(['xev9s']);
    $('#x-favn').textContent=CS.fav.length; $('#x-fav').setAttribute('aria-pressed',CS.favOnly);
    $('#x-count').innerHTML='<b>'+res.length+'</b> of '+CARS.length+' cars';
    $('#x-out').innerHTML=res.length? res.map(function(c){return carCard(c,{pick:pickIds.indexOf(c.id)>-1?'Best pick':''});}).join('') : '<div class="note warn" style="grid-column:1/-1"><span class="lbl">Nothing here</span><p>'+(CS.favOnly&&!CS.fav.length?'You have not saved any cars yet. Tap the heart on a car to save it.':'No car matches these filters. Raise the budget or clear a filter.')+'</p></div>';
    cmpUi();
  }
  ['x-q','x-b','x-body','x-seat','x-fast','x-sort','x-t'].forEach(function(id){ document.getElementById(id).addEventListener('input',list); });
  $('#x-fav').addEventListener('click',function(){ CS.favOnly=!CS.favOnly; this.setAttribute('aria-pressed',CS.favOnly); list(); });
  $('#x-cls').addEventListener('click',function(e){ var b=e.target.closest('[data-cls]'); if(!b) return; var k=b.getAttribute('data-cls'), i=CS.classes.indexOf(k); if(i>-1) CS.classes.splice(i,1); else CS.classes.push(k); b.setAttribute('aria-pressed',i<0); list(); });
  /* card events (finder + list) */
  root.addEventListener('click',function(e){
    var m=e.target.closest('[data-act="more"]'); if(m){ var id=m.getAttribute('data-id'); CS.open[id]=!CS.open[id]; $$('.car[data-id="'+id+'"]').forEach(function(card){ card.classList.toggle('detail-open',CS.open[id]); var bb=$('[data-act="more"]',card); bb.textContent=CS.open[id]?'Hide details':'Details'; bb.setAttribute('aria-expanded',CS.open[id]); }); return; }
    var fv=e.target.closest('[data-act="fav"]'); if(fv){ var fid=fv.getAttribute('data-id'), fi=CS.fav.indexOf(fid); if(fi>-1) CS.fav.splice(fi,1); else CS.fav.push(fid); store('fav',CS.fav);
      $$('[data-act="fav"][data-id="'+fid+'"]').forEach(function(x){ var on=CS.fav.indexOf(fid)>-1; x.setAttribute('aria-pressed',on); x.textContent=on?'♥':'♡'; }); var fn=$('#x-favn'); if(fn) fn.textContent=CS.fav.length; if(CS.favOnly&&fi>-1) list(); document.dispatchEvent(new CustomEvent('favchange')); return; }
    var cm=e.target.closest('[data-act="cmp"]'); if(cm){ var cid=cm.getAttribute('data-id'), i=CS.cmp.indexOf(cid);
      if(cm.checked){ if(CS.cmp.length>=3){ cm.checked=false; showTip('You can compare up to three cars. Untick one first.',e.clientX,e.clientY); setTimeout(hideTip,1800); return; } CS.cmp.push(cid); } else if(i>-1) CS.cmp.splice(i,1);
      $$('[data-act="cmp"][data-id="'+cid+'"]').forEach(function(x){x.checked=CS.cmp.indexOf(cid)>-1;}); store('cmp',CS.cmp); cmpUi(); }
  });
  function cmpUi(){
    var bar=$('#cmpbar'); if(!CS.cmp.length){ bar.hidden=true; $('#cmp-out').innerHTML='<div class="note info"><span class="lbl">Nothing selected</span><p>Tick “Compare” on a few cars in the list above and they will appear here side by side.</p></div>'; return; }
    bar.hidden=false; bar.innerHTML='<div class="card row between" style="padding:10px 14px;border:2px solid var(--nh)"><span><b>'+CS.cmp.length+'</b> of 3 selected: '+CS.cmp.map(function(i){return esc(carById(i).nm);}).join(', ')+'</span><span class="row"><button class="btn sm pri" data-jump="cars-cmp">View comparison</button><button class="btn sm" data-act="clr">Clear</button></span></div>';
    var cs=CS.cmp.map(carById);
    function best(fn,dir){ var vals=cs.map(fn); var ok=vals.filter(function(v){return v!=null;}); if(ok.length<2) return vals.map(function(){return false;}); var t=dir>0?Math.max.apply(null,ok):Math.min.apply(null,ok); return vals.map(function(v){return v===t;}); }
    var rows=[
     ['Price from',function(c){return fmtLakh(c.p[0]);},best(function(c){return c.p[0];},-1)],
     ['Battery (kWh)',function(c){return c.bat;},best(function(c){return c.bat;},1)],
     ['Claimed range',function(c){return c.cl?c.cl+' km':'-';},[]],
     ['Real range',function(c){return c.re?c.re+' km'+(c.rk==='E'?' (est.)':''):'-';},best(function(c){return c.re;},1)],
     ['City / highway test',function(c){return c.rs?c.rs[0]+' / '+c.rs[1]+' km':'blend only';},[]],
     ['% of claim',function(c){return c.re&&c.cl?Math.round(c.re/c.cl*100)+'%':'-';},best(function(c){return c.re&&c.cl?c.re/c.cl:null;},1)],
     ['km per kWh',function(c){return c.re?(c.re/c.bat).toFixed(1):'-';},best(function(c){return c.re?c.re/c.bat:null;},1)],
     ['Electricity ₹/km',function(c){var v=costPerKm(c,CS.tariff);return v?'₹'+v.toFixed(2):'-';},best(function(c){return costPerKm(c,CS.tariff);},-1)],
     ['Fast charge 10-80%',function(c){return c.dc?c.dc+' min'+(c.meas?' (measured)':c.dce?' (est.)':' (listed)'):'AC only';},best(function(c){return c.dc||null;},-1)],
     ['Owner rating (CarWale)',function(c){var o=ownerInfo(c);return o?(o.lvl==='toofew'?'only '+o.n+' ratings':o.r.toFixed(1)+' / 5 ('+o.n+')'):'none found';},best(function(c){var o=ownerInfo(c);return o&&o.n>=10?o.adj:null;},1)],
     ['Seats',function(c){return c.seats;},[]],
     ['Battery cover',function(c){return esc(c.wr);},[]],
     ['Crash test',function(c){return esc(c.ncap||'None found');},[]],
     ['Battery rental',function(c){return c.baas?fmtLakh(c.baas.price)+' + ₹'+c.baas.perKm+'/km':'-';},[]]
    ];
    $('#cmp-out').innerHTML='<div class="tbl"><table><thead><tr><th><span class="sr">Feature</span></th>'+cs.map(function(c){return '<th>'+esc(c.br+' '+c.nm)+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr><td><b>'+r[0]+'</b></td>'+cs.map(function(c,i){return '<td'+(r[2][i]?' style="background:var(--good-bg)"':'')+'>'+r[1](c)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
  }
  $('#cmpbar').addEventListener('click',function(e){ if(e.target.closest('[data-act="clr"]')){ CS.cmp=[]; $$('[data-act="cmp"]').forEach(function(x){x.checked=false;}); store('cmp',[]); cmpUi(); } });
  list();
}
