/* ===== CHARGING tab ===== */
function connIcon(kind){
  var s='<svg viewBox="0 0 84 84" aria-hidden="true">';
  if(kind==='3pin') s+='<circle class="shell" cx="42" cy="42" r="34"/><circle class="pin" cx="42" cy="26" r="5.5"/><circle class="pin" cx="27" cy="52" r="5.5"/><circle class="pin" cx="57" cy="52" r="5.5"/>';
  if(kind==='t2') s+='<path class="shell" d="M10 22 H74 V46 A32 32 0 0 1 10 46 Z"/><circle class="pin" cx="26" cy="34" r="4"/><circle class="pin" cx="42" cy="34" r="4"/><circle class="pin" cx="58" cy="34" r="4"/><circle class="pin" cx="22" cy="50" r="4"/><circle class="pin" cx="42" cy="55" r="4"/><circle class="pin" cx="62" cy="50" r="4"/><circle class="pin" cx="42" cy="44" r="3"/>';
  if(kind==='ccs2') s+='<path class="shell" d="M14 8 H70 V30 A28 28 0 0 1 14 30 Z"/><circle class="pin" cx="28" cy="20" r="3.5"/><circle class="pin" cx="42" cy="20" r="3.5"/><circle class="pin" cx="56" cy="20" r="3.5"/><circle class="pin" cx="25" cy="32" r="3.5"/><circle class="pin" cx="42" cy="37" r="3.5"/><circle class="pin" cx="59" cy="32" r="3.5"/><circle class="big" cx="26" cy="68" r="11"/><circle class="big" cx="58" cy="68" r="11"/><rect class="shell" x="14" y="55" width="56" height="26" rx="13" style="fill:none"/>';
  if(kind==='chademo') s+='<circle class="shell" cx="42" cy="42" r="34"/><circle class="big" cx="26" cy="52" r="8"/><circle class="big" cx="58" cy="52" r="8"/><circle class="pin" cx="42" cy="22" r="3.5"/><circle class="pin" cx="30" cy="30" r="3.5"/><circle class="pin" cx="54" cy="30" r="3.5"/><circle class="pin" cx="42" cy="38" r="3.5"/><circle class="pin" cx="42" cy="66" r="3.5"/>';
  return s+'</svg>';
}
function viewCharging(){
  var ways=[
   ['Wall socket','15A 3-pin · about 2.3-3.3 kW','A portable charger that plugs into a normal wall socket. Many cars come with one.','About '+kmhAdded(2.3)+'-'+kmhAdded(3.3)+' km added per hour. A day of city driving fills overnight.','Slowest option. The wiring and socket must be checked by an electrician first.'],
   ['Home wallbox','Type 2 · 7.4 kW','A wall unit on its own circuit with its own breaker, installed by a qualified electrician.','About '+kmhAdded(7.4)+' km added per hour. Most cars fill overnight with hours to spare.','The best long-term habit. Prices vary by brand, so get a written quote that includes installation.'],
   ['Public AC','Type 2 · 7.4-22 kW','At offices, malls, hotels and societies. Your car’s onboard charger sets the limit, so a 22 kW point is not faster for a car that accepts 7.4 or 11 kW.','At 11 kW about '+kmhAdded(11)+' km per hour. Good while you shop or work.','Prices vary by operator. Check the app before you plug in.'],
   ['DC fast','CCS2 · 30-360 kW','Highway and city fast chargers. The charger feeds the battery directly. Speed depends on both the charger and the car.','Autocar India measured 20-80% in 16 to 38 minutes on cars with a 40-85 kWh battery, using 90-360 kW chargers.','Costs more per unit than home. Use it for trips, not daily top-ups.']
  ];
  var ladder=[['3.3 kW socket',3.3],['7.4 kW wallbox',7.4],['11 kW public AC',11]].map(function(l){var kmh=kmhAdded(l[1]);
    return '<div class="r"><span>'+l[0]+'</span><div class="bar" data-tip="<b>'+l[0]+'</b><br>Up to about '+kmh+' km of range per hour<br>Your car’s own AC limit may be lower"><i style="width:'+Math.min(100,kmh/70*100)+'%"></i></div><span class="num">'+kmh+' km/h</span></div>';}).join('');
  var dcAvg=CARS.filter(function(c){return c.m;}).map(function(c){return 0.6*c.bat/(c.m[0]/60);}), dcLo=Math.min.apply(null,dcAvg), dcHi=Math.max.apply(null,dcAvg), per100=function(kw){return Math.round(100/KPK/kw*60);};
  return ''+
  '<div class="intro"><div><div class="kicker">Plugs, speeds, costs, and where to charge</div><h1>Charging, explained</h1></div>'+
  '<p class="lead">You will charge at home most days. Fast chargers are for highway trips. Here is every kind of charger, what each costs, and how to plan.</p></div>'+
  '<div class="jump">'+[['ch-ways','Ways to charge'],['ch-plug','Plugs'],['ch-calc','Time calculator'],['ch-curve','Why stop at 80%'],['ch-home','At home'],['ch-public','Public chargers'],['ch-cost','What it costs'],['ch-apps','Apps and networks']].map(function(j){return '<button class="chip" data-jump="'+j[0]+'">'+j[1]+'</button>';}).join('')+'</div>'+

  '<div class="note warn" style="margin-bottom:14px"><span class="lbl">Not every car can fast charge</span><p>The MG Comet EV and the Vayve Eva have no fast-charging socket. They charge on AC only, so they suit city use. Every other car in this guide can use a DC fast charger. <button class="btn sm" data-go="cars">See which cars</button></p></div>'+
  '<section class="sec" id="ch-ways">'+secHead('','Four ways','Four ways to charge a car','')+
  '<div class="grid g4">'+ways.map(function(w){return '<div class="card stack"><div><h3>'+w[0]+'</h3><div class="num small muted" style="margin-top:3px">'+w[1]+'</div></div><p class="small" style="margin:0">'+w[2]+'</p><div class="tinted small"><b>Speed:</b> '+w[3]+'</div><p class="small muted" style="margin:0">'+w[4]+'</p></div>';}).join('')+'</div>'+
  '<div class="card" style="margin-top:14px"><h4 style="margin-bottom:10px">Range added in one hour on slower chargers</h4><div class="ladder">'+ladder+'</div><p class="tiny muted" style="margin:10px 0 0">Estimate: kW × 0.9 × '+KPK+' km per kWh (the middle of independently tested cars).</p><div class="tinted small" style="margin-top:12px"><b>Fast chargers (DC) work differently.</b> In Autocar India’s tests the cars averaged '+Math.round(dcLo)+' to '+Math.round(dcHi)+' kW between 20% and 80%. At that pace, 100 km of range takes about '+per100(dcHi)+' to '+per100(dcLo)+' minutes. The charger slows down near the top.</div></div></section>'+

  '<section class="sec" id="ch-plug">'+secHead('','The plug','Plugs and sockets','Good news: almost every EV on sale in India uses one shape. On most cars the same port takes both slow (AC) and fast (DC) charging. The MG Comet EV and Vayve Eva take AC only. Pictures are simplified schematics.')+
  '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))">'+[
   ['3pin','15A 3-pin socket','The normal wall socket. Used with the portable charger that comes with the car. Needs good wiring and earthing.','Slow, 2.5-3.3 kW'],
   ['t2','Type 2','The AC plug on the car. Used at home wallboxes and public AC points. Some public AC points need your own Type 2 cable, so check before you rely on one.','AC, 3.3-22 kW'],
   ['ccs2','CCS2','Type 2 on top with two big DC pins below. The car’s port takes Type 2 and CCS2 together, so one port does both AC and DC. This is the common fast-charging plug on newer cars in India. Confirm the plug in your car’s manual.','DC fast, typically 30-350 kW'],
   ['chademo','CHAdeMO and others','Older or special plugs (GB/T, CHAdeMO) appear on a few older or imported cars. Bharat DC-001 was an older low-voltage standard. Do not assume a plug fits. Check your car’s manual. Tesla’s own chargers in India are for Tesla owners only.','Rare. Check your manual']
  ].map(function(c){return '<div class="card conn row" style="flex-wrap:nowrap;align-items:flex-start;gap:14px">'+connIcon(c[0])+'<div style="min-width:0"><h4>'+c[1]+'</h4><p class="small" style="margin:5px 0">'+c[2]+'</p><span class="pill info">'+c[3]+'</span></div></div>';}).join('')+'</div>'+
  note('warn','Safety','<p>Use branded, certified cables and adapters only. Cheap knock-offs are a fire risk.</p>')+'</section>'+

  '<section class="sec" id="ch-calc">'+secHead('','Plan a charge','How long will it take?','Pick your car and the charger. This is an estimate: real times depend on temperature, the charger’s condition, and how many cars share it.')+
  '<div class="card"><div class="fgrid">'+
   '<div class="field"><label for="c-car">Car</label><select id="c-car">'+carOptions(null,'creta')+'</select></div>'+
   '<div class="field"><div class="lab">Charger type</div><div class="seg" id="c-type"><button data-v="ac" aria-pressed="true">AC (slow)</button><button data-v="dc" aria-pressed="false">DC (fast)</button></div></div>'+
   '<div class="field"><label for="c-kw">Charger power</label><select id="c-kw"></select></div>'+
   '<div class="field"><label for="c-ack">Your car’s AC limit (kW)</label><input type="number" id="c-ack" min="1.5" max="22" step="0.1"></div>'+
   '<div class="field"><div class="lab">From</div><div class="val" id="c-fv"></div><input type="range" id="c-f" min="0" max="95" step="5" value="20" aria-label="Start charge percent"></div>'+
   '<div class="field"><div class="lab">To</div><div class="val" id="c-tv"></div><input type="range" id="c-t" min="5" max="100" step="5" value="80" aria-label="End charge percent"></div>'+
   '<div class="field"><label for="c-p">Price per kWh (₹)</label><input type="number" id="c-p" min="2" max="60" step="0.5" value="8"></div>'+
  '</div><div class="row" style="margin-top:16px;gap:24px" aria-live="polite" id="c-out"></div></div></section>'+

  '<section class="sec" id="ch-curve">'+secHead('','Why people stop at 80%','Fast charging slows down near the top','To protect the battery, the charger cuts its speed as the battery fills. In Autocar India’s tests, the last 20% (80 to 100%) took 30 to 36 minutes on almost every car, as long as the 60% before it or longer. On a trip it is usually faster to stop more often at 80% than to wait for 100%.')+
  '<div class="card">'+measChart()+'</div>'+'<div class="card" style="margin-top:14px">'+curveChart()+'</div></section>'+

  '<section class="sec" id="ch-home">'+secHead('','Home is where it happens','Charging at home','')+
  '<div class="cols2"><div class="stack">'+
   '<div class="card"><h3 style="margin-bottom:8px">What to buy</h3><div class="tbl"><table><thead><tr><th>Option</th><th>Adds per hour</th><th>Good for</th></tr></thead><tbody><tr><td>Portable, about 2.3-3.3 kW</td><td class="n">'+kmhAdded(2.3)+'-'+kmhAdded(3.3)+' km</td><td>Light daily driving; backup</td></tr><tr><td>Wallbox, 7.4 kW</td><td class="n">'+kmhAdded(7.4)+' km</td><td>Most homes</td></tr><tr><td>High power, 11 kW (3-phase)</td><td class="n">'+kmhAdded(11)+' km*</td><td>Only if your car accepts it</td></tr></tbody></table></div><p class="tiny muted" style="margin:8px 0 0">*Check your car’s AC limit first. Prices depend on brand and wiring distance. Ask for a written quote that includes installation, the dedicated breaker, and the commissioning test.</p></div>'+
   '<div class="card"><h3 style="margin-bottom:8px">Wiring and safety checklist</h3><p class="small muted" style="margin:0 0 8px">Charging is a heavy load that runs for hours. Have a qualified electrician do all of this.</p><ul>'+
    ['Inspect the incoming supply, the distribution board and the cable route.','Check your sanctioned load and whether the electricity company must upgrade it.','Use a dedicated circuit for the charger. No extension boards, no shared socket strips, no extension reels.','Match wire thickness and breakers to the charger, the cable length and the conditions.','Get good earthing tested and written down.','Fit the right overcurrent and earth-leakage (RCD) protection for that charger.','Use a weatherproof enclosure if outdoors. Protect the cable so it is not crushed or stretched or lying across a walkway.','Ask the electrician to test tripping, polarity, voltage drop and heat under load.','Keep the isolating switch easy to reach and labelled.','Get a commissioning record and the invoice. Run one full unattended charge to test.'].map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></div>'+
   '<div class="card"><h3 style="margin-bottom:8px">Living in an apartment?</h3><ol>'+
    ['Talk to your RWA early, and get permission in writing before you book the car.','Ask your electricity company about its EV connection process. Some offer a separate meter or a cheaper time-of-day tariff. Ask whether it is worth it for you.','Ask whether your society plans shared charging points.','If you cannot charge at home or work, wait. Public chargers alone are a poor daily plan today.'].map(function(t){return '<li>'+t+'</li>';}).join('')+'</ol></div>'+
  '</div><div class="card stack" style="align-self:start"><h3>Home charging planner</h3>'+
   '<div class="field"><label for="h-car">Car</label><select id="h-car">'+carOptions(function(c){return c.re;},'nexon')+'</select></div>'+
   '<div class="field"><div class="lab">Distance per day</div><div class="val" id="h-dv"></div><input type="range" id="h-d" min="10" max="200" step="5" value="40" aria-label="Kilometres per day"></div>'+
   '<div class="field"><label for="h-p">Home electricity (₹ per kWh)</label><input type="number" id="h-p" value="8" min="2" max="20" step="0.5"></div>'+
   '<div id="h-out" class="stack" aria-live="polite"></div></div></div></section>'+

  '<section class="sec" id="ch-public">'+secHead('','On the road','Using a public charger, step by step','')+
  '<ol class="steps">'+[
   ['Before the trip','Install 3-4 apps: Tata Power EZ Charge, ChargeZone, Statiq, Jio-bp pulse, plus PlugShare. Set up payment in each before you go. If you can have only one app, one guide says to make it EZ Charge.'],
   ['Find a working charger','Check three things in the app: the plug type (CCS2 for DC), the power in kW, and whether it is available now. PlugShare shows recent check-ins from other drivers. About 18% of stations were not working in March 2026, so have a backup.'],
   ['Park and open the port','Park so the cable reaches the port. Open the port. Switch off or select Park, as your car’s manual says.'],
   ['Plug in and authorise','Push the connector in firmly until it clicks. Start the session in the app, with a QR code, or with a card. Wait for the car to confirm.'],
   ['Watch the first minute','The charger should ramp up. If the speed stays far below what you expected, try another gun or stall. Heat, cold or a shared charger can cut speed.'],
   ['Stop at about 80%','On a trip, leave at 80%. The last 20% is slow. Time your meal or rest stop around the charge.'],
   ['Stop, unplug and move','End the session in the app, wait for the lock to release, then unplug. Move the car so others can charge. Some stations add an idle or parking fee if you stay.'],
   ['Have a backup plan','Keep payment ready in more than one app, and know where the next charger is. Plan to arrive with at least 10-20% left, more if the next charger is far away. Never run the car down to single digits.']
  ].map(function(s,i){return '<li><div class="stone" aria-hidden="true"><i></i><b>'+(i+1)+'</b></div><div><h4>'+s[0]+'</h4><p class="small muted" style="margin:3px 0 0">'+s[1]+'</p></div></li>';}).join('')+'</ol></section>'+

  '<section class="sec" id="ch-cost">'+secHead('','Money','What charging costs','Prices change often and differ by operator and city. These are the figures I could source. Check the app for the price at the plug.')+
  '<div class="cols2 lop"><div class="tbl"><table><thead><tr><th>Where</th><th class="r">₹ per unit (kWh)</th></tr></thead><tbody>'+
   [['Home','Your electricity bill rate. This app uses ₹8 as an example.'],['Public DC fast','₹15-25 or more (one review guide)'],['Tesla Supercharger (Tesla owners only)','₹24'],['Tesla destination charger, 11 kW (Tesla owners only)','₹14'],['Public AC','Varies by operator. Check the app.']].map(function(r){return '<tr><td>'+r[0]+'</td><td class="r small">'+r[1]+'</td></tr>';}).join('')+'</tbody></table></div>'+
  '<div class="card">'+costChart()+'</div></div>'+
  '<p class="small muted" style="margin-top:10px">About 10% of the electricity you pay for is lost as heat while charging, and the cost figures include that. Example: a 40 kWh car doing '+KPK+' km per kWh needs about 6.8 kWh from the wall for every 40 km, which is about ₹55 at ₹8 per unit.</p></section>'+

  '<section class="sec" id="ch-apps">'+secHead('','Who runs the chargers','Apps and networks','Charger counts below are not exact. Official figures: 27,737 stations installed and 22,753 working in March 2026, and 4,874 more chargers approved in July 2026. Other trackers count more (up to about 52,700) because they count differently.')+
  '<div class="tbl"><table><thead><tr><th>Network</th><th>What the sources say</th><th>Type</th></tr></thead><tbody>'+NETWORKS.map(function(n){return '<tr><td><b>'+n[0]+'</b></td><td>'+n[1]+'</td><td>'+n[2]+'</td></tr>';}).join('')+'</tbody></table></div></section>';
}

function curveChart(){
  var W=640,H=260,L=44,R=14,T=14,B=38,iw=W-L-R,ih=H-T-B;
  function X(p){return L+iw*p/100;} function Y(v){return T+ih-ih*v/100;}
  function pw(p){ if(p<10) return 62+p*2.3; if(p<=55) return 85+(p-10)*0.0; if(p<=80) return 85-(p-55)*1.0; return 60-(p-80)*2.0; }
  var d=''; for (var p=0;p<=100;p+=2) d+=(d?'L':'M')+X(p).toFixed(1)+' '+Y(pw(p)).toFixed(1);
  var out='<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Illustration: charging power stays high until about 55 percent then falls, dropping sharply after 80 percent.">';
  out+='<rect x="'+X(10)+'" y="'+T+'" width="'+(X(80)-X(10))+'" height="'+ih+'" fill="var(--info-bg)" rx="6"/>';
  [0,25,50,75,100].forEach(function(v){ out+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/>'; });
  [0,20,40,60,80,100].forEach(function(p){ out+='<text x="'+X(p)+'" y="'+(H-20)+'" text-anchor="middle">'+p+'%</text>'; });
  out+='<text x="'+(L-6)+'" y="'+(T+4)+'" text-anchor="end">peak</text><text x="'+(L-6)+'" y="'+(T+ih)+'" text-anchor="end">0</text>';
  out+='<text x="'+(X(45))+'" y="'+(T+16)+'" text-anchor="middle" class="t1" style="font-size:12.5px">Best stop zone: 10 to 80%</text>';
  out+='<path d="'+d+'" fill="none" stroke="var(--s1)" stroke-width="3" stroke-linejoin="round"/>';
  out+='<circle cx="'+X(80)+'" cy="'+Y(pw(80))+'" r="5" fill="var(--s1)" stroke="var(--surface)" stroke-width="2"/>';
  out+='<text x="'+(X(80)+8)+'" y="'+(Y(pw(80))-8)+'" class="t1" style="font-size:12px">speed drops after here</text>';
  out+='<text x="'+(W/2)+'" y="'+(H-3)+'" text-anchor="middle" style="font-size:11.5px">Battery level (state of charge)  ·  vertical axis: charging power</text>';
  var hit='<rect x="'+L+'" y="'+T+'" width="'+iw+'" height="'+ih+'" fill="transparent" data-tip="Illustration only.<br>The shape is typical. Each car has its own curve."/>';
  return out+hit+'</svg><p class="tiny muted" style="margin:6px 0 0">Illustration of a typical fast-charging curve. Each car’s real curve is different. Look for a measured 10-80% time before you buy.</p>';
}
function costChart(){
  var perKm=function(t){return t/((1-LOSS)*KPK);};
  var rows=[['Home at ₹8',perKm(8),perKm(8)],['Public DC at ₹15-25',perKm(15),perKm(25)],['Tesla Supercharger ₹24',perKm(24),perKm(24)],['Petrol, ₹100/L at 12-17 km/L',100/17,100/12]];
  var W=440,L=150,R=44,rh=38,H=rows.length*rh+34,iw=W-L-R,max=9; var out='<h4 style="margin-bottom:6px">Cost per km</h4><svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Cost per km: home charging about ₹'+rows[0][1].toFixed(1)+', public fast charging ₹'+rows[1][1].toFixed(1)+' to ₹'+rows[1][2].toFixed(1)+', petrol ₹'+rows[3][1].toFixed(1)+' to ₹'+rows[3][2].toFixed(1)+'">';
  [0,2,4,6,8].forEach(function(v){ var x=L+iw*v/max; out+='<line class="grid" x1="'+x+'" x2="'+x+'" y1="4" y2="'+(H-26)+'"/><text x="'+x+'" y="'+(H-10)+'" text-anchor="middle">₹'+v+'</text>'; });
  rows.forEach(function(r,i){ var y=10+i*rh, x1=L, x2=L+iw*r[2]/max, xs=L+iw*r[1]/max, c=i===3?'var(--s2)':'var(--s1)', single=Math.abs(r[2]-r[1])<0.01;
    out+='<text class="t1" x="'+(L-8)+'" y="'+(y+14)+'" text-anchor="end">'+r[0]+'</text>';
    out+='<rect x="'+x1+'" y="'+y+'" width="'+(single?xs-L:x2-L)+'" height="16" rx="4" fill="'+c+'"'+(single?'':' opacity=".35"')+' data-tip="<b>'+r[0]+'</b><br>₹'+r[1].toFixed(2)+(single?'':' to ₹'+r[2].toFixed(2))+' per km"/>';
    if(!single) out+='<rect x="'+x1+'" y="'+y+'" width="'+(xs-L)+'" height="16" rx="4" fill="'+c+'" data-tip="<b>'+r[0]+'</b><br>₹'+r[1].toFixed(2)+' to ₹'+r[2].toFixed(2)+' per km"/>';
    out+='<text x="'+(x2+5)+'" y="'+(y+13)+'" style="font-size:11px">₹'+r[1].toFixed(1)+(single?'':'-'+r[2].toFixed(1))+'</text>'; });
  return out+'</svg><p class="tiny muted" style="margin:6px 0 0">EV figures: tariff ÷ (0.9 × '+KPK+' km per kWh). Petrol uses example values you can change on the Money tab.</p>';
}
function measChart(){
  var rows=CARS.filter(function(c){return c.m;}).map(function(c){return {c:c,a:c.m[0],b:c.m[1]};}).sort(function(x,y){return x.a-y.a;});
  var W=640,L=150,R=48,rh=38,H=rows.length*rh+54,iw=W-L-R,max=40;
  var out='<h4 style="margin-bottom:4px">Measured fast-charging times</h4><p class="small muted" style="margin:0 0 8px">Minutes on a real fast charger, tested by Autocar India. Top bar: 20 to 80%. Bottom bar: 80 to 100%.</p><svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Measured minutes for 20 to 80 percent and 80 to 100 percent charging for '+rows.length+' cars">';
  [0,10,20,30,40].forEach(function(v){ var x=L+iw*v/max; out+='<line class="grid" x1="'+x+'" x2="'+x+'" y1="4" y2="'+(H-34)+'"/><text x="'+x+'" y="'+(H-18)+'" text-anchor="middle">'+v+'</text>'; });
  out+='<text x="'+(L+iw)+'" y="'+(H-3)+'" text-anchor="end" style="font-size:11px">minutes</text>';
  rows.forEach(function(r,i){ var y=8+i*rh, c=r.c, kw=Math.round(0.6*c.bat/(r.a/60));
    out+='<text class="t1" x="'+(L-8)+'" y="'+(y+14)+'" text-anchor="end">'+esc(c.nm.replace(' (RWD)','').replace('Urban Cruiser ',''))+'</text>';
    out+='<rect x="'+L+'" y="'+y+'" width="'+(iw*r.a/max)+'" height="11" rx="3" fill="var(--s1)" data-tip="<b>'+esc(c.br+' '+c.nm)+'</b><br>20-80%: '+r.a+' min on a '+c.m[2]+' kW charger<br>Average about '+kw+' kW"/>';
    out+='<text x="'+(L+iw*r.a/max+5)+'" y="'+(y+10)+'" style="font-size:11px" class="t1">'+r.a+'</text>';
    if(r.b){ out+='<rect x="'+L+'" y="'+(y+13)+'" width="'+(iw*r.b/max)+'" height="11" rx="3" fill="var(--s2)" data-tip="<b>'+esc(c.br+' '+c.nm)+'</b><br>80-100%: '+r.b+' min"/><text x="'+(L+iw*r.b/max+5)+'" y="'+(y+23)+'" style="font-size:11px" class="t1">'+r.b+'</text>'; }
    else out+='<text x="'+(L+4)+'" y="'+(y+23)+'" style="font-size:11px">80-100% not reported</text>'; });
  out+='</svg><div class="maplegend"><span><svg width="26" height="10"><rect x="1" y="1" width="24" height="8" rx="3" fill="var(--s1)"/></svg>20 to 80%</span><span><svg width="26" height="10"><rect x="1" y="1" width="24" height="8" rx="3" fill="var(--s2)"/></svg>80 to 100%</span></div>';
  out+='<div class="tbl" style="margin-top:12px"><table><thead><tr><th>Car</th><th class="r">Battery</th><th class="r">20-80%</th><th class="r">80-100%</th><th class="r">Test charger</th><th class="r">Average power 20-80%</th></tr></thead><tbody>'+rows.map(function(r){var c=r.c; return '<tr><td><b>'+esc(c.br+' '+c.nm)+'</b></td><td class="n r">'+c.bat+' kWh</td><td class="n r">'+r.a+' min</td><td class="n r">'+(r.b?r.b+' min':'-')+'</td><td class="n r">'+c.m[2]+' kW</td><td class="n r">'+Math.round(0.6*c.bat/(r.a/60))+' kW</td></tr>';}).join('')+'</tbody></table></div>';
  out+='<p class="tiny muted" style="margin:8px 0 0">Source: <a href="https://www.autocarindia.com/auto-features/real-world-charging-times-of-all-evs-tested-in-2026-441013" target="_blank" rel="noopener noreferrer">Autocar India, real-world charging times of all EVs tested in 2026</a>. Times depend on the charger, the weather and the battery’s heat. The calculator above uses these numbers for these cars.</p>';
  return out;
}

function bindCharging(){
  var type='ac';
  var AC=[[3.3,'3.3 kW · portable'],[7.2,'7.2 kW · wallbox'],[11,'11 kW · public AC'],[22,'22 kW · public AC']];
  var DC=[[25,'25 kW · slow DC'],[30,'30 kW'],[60,'60 kW · DC fast'],[120,'120 kW · fast'],[150,'150 kW · fast'],[180,'180 kW · fast'],[240,'240 kW · ultra-fast'],[360,'360 kW · ultra-fast (rare)']];
  function fillKw(){ var cur=type==='ac'?7.2:60; $('#c-kw').innerHTML=(type==='ac'?AC:DC).map(function(o){return '<option value="'+o[0]+'"'+(o[0]===cur?' selected':'')+'>'+o[1]+'</option>';}).join(''); $('#c-p').value=type==='ac'?8:24; }
  function carChanged(){ var c=carById($('#c-car').value); $('#c-ack').value=c.ac; calc(); }
  function calc(){
    var c=carById($('#c-car').value), f=num('c-f',20), t=num('c-t',80); if(t<=f){ t=Math.min(100,f+5); $('#c-t').value=t; }
    $('#c-fv').textContent=f+'%'; $('#c-tv').textContent=t+'%'; var kw=num('c-kw',7.2), price=num('c-p',8), kwh=c.bat*(t-f)/100, out='';
    var km=c.re?Math.round(kwh*c.re/c.bat):null;
    if(type==='dc'&&!c.dc){ $('#c-out').innerHTML='<div class="note warn" style="flex:1"><span class="lbl">No fast charging</span><p>The '+esc(c.br+' '+c.nm)+' charges on AC only. Choose AC, or pick another car.</p></div>'; return; }
    var mins=type==='dc'? dcMinutes(c,f,t,kw) : acHours(c.bat,f,t,kw,num('c-ack',c.ac))*60;
    var lim=type==='ac'&&kw>num('c-ack',c.ac);
    out='<div class="stat"><div class="v">'+fmtDur(mins)+'</div><div class="l">Time</div></div><div class="stat"><div class="v">'+kwh.toFixed(1)+' kWh</div><div class="l">Energy added</div></div>'+(km?'<div class="stat"><div class="v">~'+km+' km</div><div class="l">Range added</div></div>':'')+'<div class="stat"><div class="v">'+fmtRs(kwh/(1-LOSS)*price)+'</div><div class="l">Cost</div></div>';
    out+='<div class="small muted" style="flex-basis:100%;margin:0">'+(lim?'Your car accepts only '+num('c-ack',c.ac)+' kW on AC, so the charger runs at that limit. ':'')+(type==='dc'&&kw>(0.7*c.bat/(c.dc/60))*1.4?'The charger is more powerful than the car can use, so the car sets the speed. ':'')+(type==='dc'&&t>80?'Above 80% the charger slows to about a third of the speed. ':'')+(c.dce&&type==='dc'?'This car’s fast-charging time is a class estimate. ':'')+'</div>';
    $('#c-out').innerHTML=out;
  }
  $('#c-car').addEventListener('change',carChanged);
  $('#c-type').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; type=b.getAttribute('data-v'); $$('#c-type button').forEach(function(x){x.setAttribute('aria-pressed',x===b);}); fillKw(); calc(); });
  ['c-kw','c-ack','c-f','c-t','c-p'].forEach(function(id){ document.getElementById(id).addEventListener('input',calc); });
  fillKw(); carChanged();
  /* home planner */
  function home(){
    var c=carById($('#h-car').value), d=num('h-d',40), p=num('h-p',8); $('#h-dv').textContent=d+' km';
    var kwh=d/(c.re/c.bat)/(1-LOSS), h33=kwh/Math.min(3.3,c.ac), h72=kwh/Math.min(7.2,c.ac), cost=kwh*p, month=cost*30;
    var verdict= h33<=9 ? note('good','Fits overnight','<p>Even a plain 3.3 kW portable charger refills a day’s driving overnight.</p>') : h72<=9 ? note('warn','Wallbox recommended','<p>The portable charger needs '+h33.toFixed(1)+' hours. A 7.2 kW wallbox does it in '+h72.toFixed(1)+' hours.</p>') : note('bad','Needs a bigger plan','<p>Even a 7.2 kW wallbox takes '+h72.toFixed(1)+' hours. Add workplace or public charging, or choose a car with a faster AC charger.</p>');
    $('#h-out').innerHTML='<div class="row" style="gap:22px"><div class="stat"><div class="v">'+kwh.toFixed(1)+'</div><div class="l">kWh per day</div></div><div class="stat"><div class="v">'+fmtRs(month)+'</div><div class="l">Per month</div></div><div class="stat"><div class="v">₹'+(cost/d).toFixed(2)+'</div><div class="l">Per km</div></div></div>'+
      '<div class="tinted small">Portable 3.3 kW: <b>'+fmtDur(h33*60)+'</b> · Wallbox 7.2 kW: <b>'+fmtDur(h72*60)+'</b>'+(c.ac<7.2?' <span class="muted">(this car’s AC limit is '+c.ac+' kW)</span>':'')+'</div>'+verdict;
  }
  ['h-car','h-d','h-p'].forEach(function(id){ document.getElementById(id).addEventListener('input',home); }); home();
}
