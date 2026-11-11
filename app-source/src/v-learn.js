/* ===== LEARN tab ===== */
var GLOSS=[
['Battery','kWh (kilowatt-hour)','The size of the battery. Think of it as the fuel tank in litres. A 50 kWh battery holds about twice as much energy as a 25 kWh one. Most tested cars here use roughly 5 to 11 km of range per kWh.'],
['Charging','kW (kilowatt)','The speed of energy flow. Think of the tap or the pump nozzle. Higher kW fills the tank faster. Rule of thumb: hours to fill = kWh ÷ kW. A 50 kWh battery on a 7 kW charger needs about 7 hours (a bit more with losses).'],
['Battery','Gross vs usable capacity','Gross is the total the battery can hold. Usable is what the car lets you use, keeping a safety buffer at both ends. Brands quote them differently. For example, a pack sold as 64 kWh may give 60 kWh usable. Always ask which one a number means.'],
['Battery','Range (claimed)','The distance the maker says a full battery covers, from a lab test. In India it is usually the ARAI or MIDC figure. Imported cars often quote the WLTP figure. You will almost never get this number in daily use.'],
['Battery','Range (real-world)','What independent testers measure on real roads with traffic and highway speeds. In this guide it is mostly 65% to 90% of the claim. Plan with this number, not the brochure.'],
['Driving','Efficiency (km per kWh)','Like km per litre. Higher is better. The best tested here is the MG Comet at about 11 km/kWh. The Creta Electric gets 8.4. A heavy SUV like the Harrier EV AWD gets 5.35. A smaller battery in an efficient car can beat a bigger battery in a heavy one.'],
['Battery','SoC (state of charge)','The fuel gauge in percent. 80% means the battery is four-fifths full.'],
['Battery','SoH (state of health)','How much capacity the battery still has compared with new. 100% is brand new. Tata’s warranty promises repair or replacement if it falls below 70% during the cover period. A 50 kWh pack at 80% SoH holds about 40 kWh.'],
['Battery','Degradation','The slow, normal loss of battery capacity over the years. Heat, frequent fast charging, and sitting at 100% or near 0% for long all speed it up.'],
['Battery','Cell, module, pack','Small cells are grouped into modules, and modules into the pack under the floor. Ask whether the pack can be repaired by replacing a module or only as a whole unit.'],
['Battery','LFP and NMC','The two common battery chemistries. See the comparison table below. Ask the dealer which one your car has.'],
['Battery','BMS (battery management system)','The battery’s brain. It watches every cell, keeps them balanced, protects against heat and over-charging, and estimates the range you see on the screen.'],
['Battery','Thermal management','Cooling (and sometimes heating) of the battery. Liquid cooling helps in Indian summers and during fast charging. Heat is the battery’s biggest enemy.'],
['Battery','Cycle','One full charge and discharge worth of energy. Two 50% top-ups count as one cycle. Warranties often quote years and km instead of cycles.'],
['Battery','Vampire drain','A small amount of charge lost while the car is parked and locked, because the computers stay on. Usually small, but it adds up over weeks of parking.'],
['Charging','AC charging','Alternating current from the wall. The car’s own onboard charger converts it to battery power. Slower, gentle, and what you use at home and at many public points.'],
['Charging','DC fast charging','The charger converts the power itself and feeds the battery directly, so it can be much faster. Used on highways. Costs more per unit.'],
['Charging','Onboard charger (OBC)','The converter inside the car that limits how fast AC charging can go. Most Indian EVs top out at 7.2 kW or 11 kW, so a 22 kW public AC point will not charge them any faster.'],
['Charging','Charging curve and taper','Fast charging is quick up to about 80%, then slows a lot to protect the battery. In Autocar India’s tests, the last 20% (80 to 100%) took 30 to 36 minutes on most cars, about as long as the 60% before it. This is why people stop at 80% on trips.'],
['Charging','10-80% time','The number to compare when buying. It tells you how long a typical highway stop takes. Be careful: some brands quote 20-80%, which is shorter.'],
['Charging','Peak vs average speed','A car may hit 150 kW for a moment but average only 90 kW across the stop. Look at measured 10-80% times, not the peak.'],
['Charging','400V and 800V','The battery’s system voltage. 800V cars (such as the Ioniq 5 and Mercedes GLC Electric) can hold very fast charging speeds for longer, if the charger is powerful enough.'],
['Charging','CCS2, Type 2, 15A socket','The plug shapes. Almost every EV on sale in India uses one port that takes Type 2 (AC) and CCS2 (DC fast). See the Charging tab for pictures.'],
['Charging','CPO (charge point operator)','The company that runs a public charger, such as Tata Power EZ Charge, ChargeZone or Statiq. Each has its own app and prices.'],
['Charging','Idle or parking fee','A fee some stations charge if you leave the car plugged in after charging ends, or park for long. Amounts differ by operator.'],
['Charging','Pre-conditioning','Warming or cooling the battery to the right temperature before a fast charge. Some cars do it automatically when you navigate to a charger. It saves time and protects the battery.'],
['Driving','Regenerative braking (regen)','When you lift your foot, the motor works backwards as a generator and puts a little energy back into the battery. It also slows the car and saves brake pads.'],
['Driving','One-pedal driving','A strong regen setting where lifting off the accelerator slows the car firmly, even to a stop. After a week most people drive with one pedal in the city.'],
['Driving','Instant torque','Electric motors deliver full pulling power from standstill. EVs feel quick off the line even when they are not sports cars.'],
['Driving','Single-speed gearbox','Most EVs have no gears to change. You select D and go. That is why they are smooth and why there is no clutch.'],
['Driving','V2L (vehicle to load)','A feature that lets the car power appliances, like a laptop, a kettle or camping gear, from its battery. Not every car has it, so ask.'],
['Driving','OTA update','Over-the-air software update, like on a phone. It can improve range, charging or screens. Ask how well the brand has supported earlier updates.'],
['Driving','12V battery','EVs still carry a small ordinary battery for lights, locks and screens. It can fail like any car battery, so it is checked at service.'],
['Buying','Ex-showroom price','The price before registration, road tax and insurance. The on-road price is higher. Always ask for the on-road price in writing.'],
['Buying','BaaS (battery as a service)','A scheme where you buy the car at a lower price and pay for the battery separately. In India it works two ways, covered in the Money tab.'],
['Buying','IDV (insured declared value)','The value your insurer uses for the car. Owners report that for BaaS cars it is worked out on the full price, battery included.'],
['Buying','ARAI and Bharat NCAP','ARAI tests range and efficiency in a lab. Bharat NCAP is India’s crash-test programme that gives star ratings out of 5.'],
['Buying','e-AMRIT','The government’s EV information portal. It has a charging map and other buying information.']
];

function viewLearn(){
  var tests=['tiago','comet','windsor','punch','nexon','creta','clavis','zs','curvv','harrier','xev9e','xev9s','ioniq5','m9'];
  var rows=tests.map(function(id){var c=carById(id); var pct=Math.round(c.re/c.cl*100); return {label:c.br+' '+c.nm.replace(' Electric','').replace(' EV',''),a:c.cl,b:c.re,
     tipA:'<b>'+esc(c.nm)+'</b><br>Claimed: '+c.cl+' km', tipB:'<b>'+esc(c.nm)+'</b><br>Tested: '+c.re+' km ('+pct+'% of claim)<br>'+c.bat+' kWh battery'};});
  var chart=rangeChart(rows,700);
  return ''+
  '<div class="intro"><div><div class="kicker">First-time EV buyer · India · Nov 2026</div><h1>Moving from petrol or diesel? Start here.</h1></div>'+
  '<p class="lead">Everything you need before buying your first electric car, in plain words. Learn the terms, check if an EV fits your life, pick a car, then plan charging and costs. All numbers come from the research on the other tabs.</p></div>'+
  '<div class="jump" role="navigation" aria-label="Sections on this tab">'+[['learn-quiz','Does an EV fit me?'],['learn-works','How it works'],['learn-words','Battery words'],['learn-chem','LFP vs NMC'],['learn-left','Km left?'],['learn-range','Real range'],['learn-drive','Driving'],['learn-care','Battery care'],['learn-myths','Myths']].map(function(j){return '<button class="chip" data-jump="'+j[0]+'">'+j[1]+'</button>';}).join('')+'</div>'+

  /* quiz */
  '<section class="sec" id="learn-quiz">'+secHead('', 'Step 1 · Four questions', 'Does an EV fit my life?','The biggest factor is not the car. It is where you can plug it in. Answer these and see. The answers below are an example to start.')+
  '<div class="cols2 lop"><div class="card stack" id="quiz">'+
   quizQ('park','Where does your car sleep at night?',[['own','Own parking with a plug point nearby'],['society','Society or flat parking, needs RWA approval'],['street','Street or no fixed spot']],'own')+
   quizQ('daily','How far do you drive on a normal day?',[['low','Under 40 km'],['mid','40 to 100 km'],['high','Over 100 km']],'low')+
   quizQ('trips','How often do you take long trips (300 km or more)?',[['rare','Hardly ever'],['some','A few times a year'],['often','Every month or more']],'some')+
   quizQ('only','Will this be your only car?',[['no','No, I have another'],['yes','Yes, the only one']],'yes')+
  '</div><div id="quizOut"></div></div></section>'+

  /* how it works */
  '<section class="sec" id="learn-works">'+secHead('','Step 2 · The basics','How an electric car works','Fewer parts than a petrol car, and every one has an easy match.')+
  '<div class="card" style="margin-bottom:14px">'+workDiagram()+'</div>'+
  '<div class="grid">'+[
   ['Fuel tank → Battery','A big battery pack sits under the floor. It stores electricity instead of petrol. It is measured in kWh.'],
   ['Engine → Electric motor','The motor turns the wheels. It has very few moving parts, so it is quiet and responds instantly.'],
   ['Gearbox → One gear','No clutch and no gear changes. You press D and go.'],
   ['Petrol pump → A plug','Most charging happens at home overnight. Fast chargers are for highway trips.'],
   ['Brakes → Regen + brakes','Lifting off the pedal recovers energy. Brake pads last longer.'],
   ['Servicing → Much lighter','No engine oil, spark plugs, clutch or exhaust. You still need tyres, brakes, coolant, cabin filters, suspension and a yearly check of the high-voltage system.']
  ].map(function(x){return '<div class="card flat"><h4>'+x[0]+'</h4><p class="small muted" style="margin-top:6px">'+x[1]+'</p></div>';}).join('')+'</div></section>'+

  /* glossary */
  '<section class="sec" id="learn-words">'+secHead('','Step 3 · The language','Battery and charging words','Tap a word to read it. Filter by topic or search.')+
  '<div class="card" style="margin-bottom:14px"><h3 style="margin-bottom:6px">Tank and tap: kWh vs kW</h3>'+
  '<p class="small muted">This is the single most useful idea. kWh is the size of the tank. kW is the speed of the tap. Move the sliders.</p>'+
  '<div class="fgrid"><div class="field"><div class="lab">Battery size</div><div class="val" id="tt-bv"></div><input type="range" id="tt-b" min="10" max="120" step="0.5" value="51.4" aria-label="Battery size in kWh"></div>'+
  '<div class="field"><label for="tt-c">Charger speed</label><select id="tt-c">'+[[2.5,'2.5 kW · wall socket'],[3.3,'3.3 kW · portable charger'],[7.2,'7.2 kW · home wallbox'],[11,'11 kW · public AC'],[30,'30 kW · slow DC'],[60,'60 kW · DC fast'],[120,'120 kW · fast'],[240,'240 kW · ultra-fast']].map(function(o){return '<option value="'+o[0]+'"'+(o[0]===7.2?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div></div>'+
  '<div class="row" style="margin-top:12px;gap:18px" aria-live="polite"><div class="stat"><div class="v" id="tt-out">-</div><div class="l">Empty to full, roughly</div></div><div class="small muted" id="tt-txt" style="flex:1;min-width:220px"></div></div></div>'+
  '<div class="row" style="margin-bottom:10px"><input type="search" id="gl-q" placeholder="Search a word, like SoH or regen" aria-label="Search the glossary" style="flex:1;min-width:200px;max-width:340px"><div class="row" id="gl-f">'+['All','Battery','Charging','Driving','Buying'].map(function(t,i){return '<button class="chip" data-gf="'+t+'" aria-pressed="'+(i===0)+'">'+t+'</button>';}).join('')+'</div></div>'+
  '<div class="card flat" style="padding:4px 16px" id="gl-list"></div></section>'+

  /* chemistry */
  '<section class="sec" id="learn-chem">'+secHead('','Step 4 · Two chemistries','LFP vs NMC: what is inside the battery','Brands rarely shout about this, but it changes how you should charge. These are general battery facts, not figures from a single car. Always follow your owner’s manual.')+
  '<div class="tbl"><table><thead><tr><th><span class="sr">Feature</span></th><th>LFP (lithium iron phosphate)</th><th>NMC / NCA (nickel-based)</th></tr></thead><tbody>'+
  [['Good at','Long life, many cycles, stable, usually cheaper','More energy for its weight, so more range per kg'],
   ['Weak at','Heavier for the same energy','Prefers not to sit at 100%, a bit more fussy in heat'],
   ['Daily charging','Many makers allow charging to 100% regularly','Daily limit of about 80-90% is common; 100% only before a trip'],
   ['How to know','Ask the dealer and read the manual','Same: ask for the chemistry and the daily charge limit in writing']].map(function(r){return '<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>';}).join('')+'</tbody></table></div></section>'+

  /* km left */
  '<section class="sec" id="learn-left">'+secHead('','Step 5 · Reading the meter','How many km do I have left?','Your car works this out itself. Knowing how helps you judge when to believe it.')+
  '<div class="cols2 lop"><div class="card stack">'+
  '<h3>The car’s guess</h3>'+
  '<p class="small" style="margin:0">The car takes the battery percentage, turns it into kWh, and multiplies by your recent km per kWh (usually your last 20 to 50 km). Some cars also count the AC and outside temperature. So the number is a guess based on how you have been driving.</p>'+
  '<ul class="small" style="margin:0;padding-left:18px;display:grid;gap:5px"><li><b>Fast highway driving</b> uses more energy, so the km number falls quickly.</li><li><b>Gentle city driving or a downhill</b> makes it climb.</li><li><b>AC, heat and cold</b> push it down.</li><li>After days of slow city use, the car assumes you will keep doing that and shows a flattering number.</li></ul>'+
  '<div class="note info"><span class="lbl">Trust the percentage</span><p>The percentage is more reliable than the km figure. Plan trips by percentage, and never plan to arrive below 10%. Keep 15 to 20% spare.</p></div>'+
  '</div>'+
  '<div class="card stack"><h3>Work it out yourself</h3>'+
  '<p class="small muted" style="margin:0">Km left = battery size (kWh) × % left × km per kWh</p>'+
  '<div class="field"><label for="lf-car">Pick a car (optional)</label><select id="lf-car"><option value="">Use my own battery size</option>'+CARS.filter(function(c){return c.bat&&c.re;}).map(function(c){return '<option value="'+c.id+'">'+esc(c.br+' '+c.nm)+' · '+c.bat+' kWh</option>';}).join('')+'</select></div>'+
  '<div class="fgrid"><div class="field"><div class="lab">Battery size</div><div class="val" id="lf-bv"></div><input type="range" id="lf-b" min="10" max="120" step="0.5" value="40" aria-label="Battery size in kWh for the range-left calculator"></div>'+
  '<div class="field"><div class="lab">Battery left</div><div class="val" id="lf-pv"></div><input type="range" id="lf-p" min="5" max="100" step="1" value="60" aria-label="Battery percentage left"></div></div>'+
  '<div class="field"><label for="lf-s">How are you driving?</label><select id="lf-s">'+[[7,'Gentle city driving · 7 km/kWh'],[6,'Mixed city and road · 6 km/kWh'],[4.5,'Fast highway · 4.5 km/kWh'],[3.5,'Fast highway, hot day with AC · 3.5 km/kWh']].map(function(o,i){return '<option value="'+o[0]+'"'+(i===1?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div>'+
  '<div class="row" style="gap:18px" aria-live="polite"><div class="stat"><div class="v" id="lf-out">-</div><div class="l">Km left, roughly</div></div><div class="stat"><div class="v" id="lf-safe">-</div><div class="l">Usable, keeping 15% spare</div></div></div>'+
  '<p class="small muted" style="margin:0" id="lf-txt"></p></div></div></section>'+

  /* range */
  '<section class="sec" id="learn-range">'+secHead('','Step 6 · Range','Claimed vs real range','Light bar is the maker’s claim. Dark bar is what independent tests measured. Hover or tap a bar for details.')+
  '<div class="card">'+chart+'<div class="legend" style="margin-top:8px"><span><i style="background:var(--s1-soft)"></i>Claimed (ARAI / MIDC)</span><span><i style="background:var(--s1)"></i>Tested on real roads</span></div></div>'+
  '<div class="cols2" style="margin-top:14px"><div class="note info"><span class="lbl">Simple rule</span><p>Plan with about 65% to 90% of the claimed range. Efficient cars like the Creta Electric and MG Windsor came close to their claims. Big SUVs fell further short.</p></div>'+
  '<div class="note warn"><span class="lbl">Stops are shorter than range</span><p>You rarely drive from 100% to 0%. If you charge between 20% and 80%, the distance between stops is about 60% of the full range. Always keep a buffer.</p></div></div>'+
  note('info','How the tested number is made','<p>Most tested figures here come from Autocar India. In its XEV 9e test it drove a fixed city loop and a fixed highway loop with the AC at 22°C, then worked out the range from the share of charge used. The result is a blend of city and highway, so think of it as a middle value, not a limit. Heat, traffic and a heavy car push it down. Mild weather and steady driving can beat it, and fast highway driving can fall below it. Other testers use other methods, so numbers differ by source. Where a test reports the city and highway split, the car card shows it.</p>').replace('class="note info"','class="note info" style="margin-top:14px"')+'</section>'+

  /* driving */
  '<section class="sec" id="learn-drive">'+secHead('','Step 7 · On the road','Driving your first EV','What feels different in the first week.')+
  '<div class="grid">'+[
   ['It is quiet and quick','Full pulling power from zero. Pull out of junctions smoothly and without a gearbox jerk. Watch your speed in the city because it builds up quietly.'],
   ['Try one-pedal driving','Set regen to the stronger setting and let the accelerator do the braking. Keep your foot ready for the real brake pedal.'],
   ['Speed costs range','Steady 80-90 km/h uses much less energy than 110+ km/h. Fast highway driving is where real range falls furthest from the claim.'],
   ['Heavy loads and hills','Full seats, roof boxes and long climbs use more energy. Going downhill gives some back through regen.'],
   ['Tyres matter','Correct tyre pressure helps range. Check it as often as you would on a petrol car.'],
   ['Pre-cool while plugged in','Cool the cabin while still connected to the charger so the battery does not pay for it. AC itself is a modest drain.']
  ].map(function(x){return '<div class="card flat"><h4>'+x[0]+'</h4><p class="small muted" style="margin-top:6px">'+x[1]+'</p></div>';}).join('')+'</div></section>'+

  /* care */
  '<section class="sec" id="learn-care">'+secHead('','Step 8 · Habits','Looking after the battery','The battery is the costly part. These habits are free. Battery life is commonly 8 to 15 years, and warranties are now long: 8 years or 1.6 lakh km at most brands; lifetime cover for the first owner on some Tata, Mahindra and MG models, with conditions.')+
  '<div class="cols2"><div class="card"><h3 style="color:var(--good)">Do</h3><ul>'+
   ['Plug in at home when it suits you. You do not need to wait for it to run low.','Follow the daily charge limit in your owner’s manual. Charge to 100% only before a long trip, and leave soon after.','Park in shade in summer. Heat ages a battery faster than anything else.','Use fast chargers for trips. Occasional fast charging is normal.','Keep software updated and go to the authorised service centre for the yearly high-voltage check.','Use branded, certified cables and chargers only.'].map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></div>'+
  '<div class="card"><h3 style="color:var(--bad)">Avoid</h3><ul>'+
   ['Leaving the car at 100% or near 0% for days.','Fast charging again and again when the battery is hot or nearly full. It adds stress.','Cheap knock-off cables or adapters. They are a fire risk.','Plugging a high-power charger into an old, worn 15A socket and leaving it all night. Have an electrician check the wiring first.','Driving into deep water. Batteries are sealed, but a high-voltage pack is not made for wading.','Letting someone not trained in high-voltage systems open the battery or orange cables.'].map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></div></div>'+
  '<div class="note warn" style="margin-top:14px"><span class="lbl">Read your warranty</span><p>Lifetime warranties have conditions: usually the first private owner only, with servicing at authorised centres. Tata’s “lifetime” means 15 years from first registration with a minimum 70% battery health. Get the exact wording in writing.</p></div></section>'+

  /* myths */
  '<section class="sec" id="learn-myths">'+secHead('','Step 9 · Straight talk','Myths and facts','')+
  '<div class="card flat" style="padding:4px 16px">'+[
   ['“EVs cannot do highways.”','The best tested cars run 450 to 500 km on real roads (XEV 9S 478 km, Ioniq 5 501 km). Roughly 91% of national highways have a charger about every 50 km, though coverage is uneven. Rajasthan, the hills and some east-coast stretches are thin. Check the Map tab and plan.'],
   ['“The battery will die in 3-4 years.”','Warranties of 8 years / 1.6 lakh km are standard, and some brands offer lifetime cover for the first owner. Typical life is 8 to 15 years. Batteries age slowly, and what you lose is range, not the car.'],
   ['“EVs are too expensive.”','The sticker can be higher for the same size, but EVs pay only 5% GST and cost about ₹1 to ₹1.5 per km at home, against ₹6 to ₹8 per km for petrol. The Money tab does the maths with your numbers.'],
   ['“Public chargers are everywhere.”','Not yet. Roughly 1 public charger serves about 235 EVs, and about 18% of installed stations were not working in March 2026. Home or workplace charging is what makes EV ownership easy.'],
   ['“Rain is dangerous.”','Charging in the rain is normal if the cable and socket are undamaged. Avoid flooded roads. A sealed battery is not a boat.'],
   ['“EVs catch fire.”','Most home charging trouble comes from worn sockets, poor wiring and cheap chargers, not from the car. Use certified gear, a dedicated breaker and written proof of earthing.']
  ].map(function(m){return '<details><summary>'+m[0]+'</summary><div><p>'+m[1]+'</p></div></details>';}).join('')+'</div></section>';
}
function quizQ(key,q,opts,def){
  return '<div class="field"><div class="lab">'+q+'</div><div class="seg" role="group" aria-label="'+esc(q)+'" data-q="'+key+'" style="flex-wrap:wrap">'+opts.map(function(o){return '<button data-v="'+o[0]+'" aria-pressed="'+(o[0]===def)+'">'+o[1]+'</button>';}).join('')+'</div></div>';
}
function workDiagram(){
  function box(x,y,w,h,t,s,cls){return '<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="'+(cls||'var(--surface2)')+'" stroke="var(--ink2)" stroke-width="1.5"/><text class="t1" x="'+(x+w/2)+'" y="'+(y+h/2-(s?2:-4))+'" text-anchor="middle" style="font-size:14px">'+t+'</text>'+(s?'<text x="'+(x+w/2)+'" y="'+(y+h/2+14)+'" text-anchor="middle" style="font-size:11.5px">'+s+'</text>':'')+'</g>';}
  function arr(x1,y1,x2,y2,c){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(c||'var(--ink)')+'" stroke-width="2.2" marker-end="url(#ah'+(c?'r':'')+')"/>';}
  return '<svg class="chart" viewBox="0 0 640 230" role="img" aria-label="Diagram: charging port feeds the battery, which powers an inverter, motor and wheels. Braking sends energy back to the battery.">'+
   '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink)"/></marker><marker id="ahr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--s2)"/></marker></defs>'+
   box(14,78,96,64,'Charging','port','var(--info-bg)')+box(150,60,130,100,'Battery pack','stores kWh','var(--s1-soft)')+box(320,78,104,64,'Inverter','DC to AC')+box(460,78,80,64,'Motor','')+box(576,86,52,48,'Wheels','')+
   arr(110,110,148,110)+arr(280,110,318,110)+arr(424,110,458,110)+arr(540,110,574,110)+
   '<path d="M600 140 C600 200 330 206 215 164" fill="none" stroke="var(--s2)" stroke-width="2.2" stroke-dasharray="5 4" marker-end="url(#ahr)"/>'+
   '<text x="410" y="198" text-anchor="middle" style="fill:var(--s2);font-weight:600;font-size:12.5px">Regenerative braking sends energy back</text>'+
   '<text x="64" y="160" text-anchor="middle" style="font-size:11.5px">home or fast charger</text>'+
   '<rect x="150" y="12" width="130" height="30" rx="8" fill="none" stroke="var(--muted)" stroke-dasharray="3 3"/><text x="215" y="31" text-anchor="middle" style="font-size:12px">12V battery for lights, locks</text></svg>';
}

function bindLearn(){
  /* quiz */
  var qa={park:'own',daily:'low',trips:'some',only:'yes'};
  function quiz(){
    var park=qa.park, d=qa.daily, t=qa.trips, only=qa.only, kind,title,body;
    var need=d==='low'?150:d==='mid'?250:400; if(t==='some') need=Math.max(need,330); if(t==='often') need=Math.max(need,400);
    var cta='<div class="row" style="margin-top:12px"><button class="btn pri" data-go="cars">See cars with ≥ '+need+' km range</button><button class="btn" data-go="charging">Home charging guide</button></div>';
    if(park==='street'){ kind='bad'; title='Wait, or fix charging first';
      body='<p>With no fixed spot you would depend on public chargers. They cost about ₹3 to ₹5 per km on DC fast, against ₹1 to ₹1.5 at home, and about 18% of installed stations were not working in March 2026.</p><p>Before buying, ask whether your office, a nearby society or a fuel station can give you a reliable, regular charging spot.</p>'; }
    else if(park==='society'){ kind='warn'; title='Possible, once your society agrees';
      body='<p>Talk to the RWA before you book. Most electricity companies now have an EV connection process, and newer societies are adding charging points. A 3.3 kW portable charger on a safe, certified socket is enough for about 12 to 18 km of range per hour.</p>'+(only==='yes'&&(t==='often'||d==='high')?'<p>Because this is your only car and you drive a lot, wait until the charging point is approved in writing.</p>':''); }
    else if(only==='yes'&&(t==='often'||d==='high')){ kind='warn'; title='Good fit, with planning';
      body='<p>Home charging makes daily driving cheap. For frequent long trips choose a car that has been tested above 400 km, one that fast-charges quickly, and learn the route planner on the Map tab. Keep one charging app on your phone for each major network.</p>'; }
    else { kind='good'; title='A very good fit';
      body='<p>You can charge at home and your driving suits an EV. Most of your charging will cost about ₹1 to ₹1.5 per km. Even small-battery cars will work for your daily routine.</p>'; }
    $('#quizOut').innerHTML=note(kind, kind==='good'?'Result':kind==='warn'?'Result: plan first':'Result: not yet', '<h3 style="margin:2px 0 8px">'+title+'</h3>'+body+cta);
  }
  $$('#quiz .seg').forEach(function(seg){ seg.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; $$('button',seg).forEach(function(x){x.setAttribute('aria-pressed',x===b);}); qa[seg.getAttribute('data-q')]=b.getAttribute('data-v'); quiz(); }); });
  quiz();
  /* tank & tap */
  function tt(){ var b=num('tt-b',50), kw=num('tt-c',7.2); $('#tt-bv').textContent=b+' kWh'; var hrs=b/(kw*(1-LOSS)); var min=hrs*60;
    $('#tt-out').textContent=kw>=30? fmtDur(min*(1+0.25))+' *' : fmtDur(min);
    $('#tt-txt').textContent=kw>=30? '* A fast charger fills 10 to 80% much quicker, then slows down for the last part. Your car’s own limit also applies, so see the Charging tab for a car-specific calculator.' : 'Time is kWh ÷ kW, plus about 10% lost as heat. If your car can only accept 7.2 kW, a faster AC point will not help.'; }
  $('#tt-b').addEventListener('input',tt); $('#tt-c').addEventListener('change',tt); tt();
  /* km left */
  function lf(){ var b=num('lf-b',40), pc=num('lf-p',60), e=num('lf-s',6); $('#lf-bv').textContent=b+' kWh'; $('#lf-pv').textContent=pc+'%';
    var left=Math.round(b*pc/100*e/5)*5, safe=Math.max(0,Math.round(b*(pc-15)/100*e/5)*5);
    $('#lf-out').textContent=left+' km'; $('#lf-safe').textContent=safe+' km';
    var cid=$('#lf-car').value, c=cid?carById(cid):null;
    $('#lf-txt').textContent=(c&&c.re?c.br+' '+c.nm+' tested about '+(Math.round(c.re/c.bat*10)/10)+' km per kWh in mixed driving. ':'')+'Rounded to 5 km. Real roads vary, so treat this as a guide, not a promise.'; }
  $('#lf-car').addEventListener('change',function(){ var c=this.value?carById(this.value):null; if(c){ $('#lf-b').value=c.bat; } lf(); });
  $('#lf-b').addEventListener('input',lf); $('#lf-p').addEventListener('input',lf); $('#lf-s').addEventListener('change',lf); lf();
  /* glossary */
  var gf='All';
  function gl(){ var q=$('#gl-q').value.trim().toLowerCase(); var list=GLOSS.filter(function(g){return (gf==='All'||g[0]===gf)&&(!q||(g[1]+' '+g[2]).toLowerCase().indexOf(q)>-1);});
    $('#gl-list').innerHTML=list.length? list.map(function(g){return '<details><summary><span>'+esc(g[1])+' <span class="pill" style="margin-left:6px">'+g[0]+'</span></span></summary><div><p>'+g[2]+'</p></div></details>';}).join('') : '<p class="muted" style="padding:14px 0">No word matches. Try fewer letters.</p>'; }
  $('#gl-q').addEventListener('input',gl);
  $('#gl-f').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; gf=b.getAttribute('data-gf'); $$('#gl-f .chip').forEach(function(x){x.setAttribute('aria-pressed',x===b);}); gl(); });
  gl();
}
