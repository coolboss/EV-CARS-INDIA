/* ===== BUY tab: road to an EV, checklists, safety, upcoming, FAQ, sources ===== */
var CHECKS={
 dealer:['Get the full on-road price in writing: car, battery, charger, installation, insurance and road tax, each on its own line.','Ask whether the low advertised price is a battery rental (BaaS) price or a battery-included price.','Confirm the exact variant: battery size, motor, wheels. Range and price differ by variant.','Ask for the independent test range of that exact variant, and what range you should expect on the highway with the AC on.','Ask for the battery warranty in writing: years, km, who it covers (first owner only?), and what battery health counts as a fault.','Ask for the 10-80% fast-charge time and the AC charging limit in kW.','Is a portable charger included? A wallbox? A Type 2 cable? Who installs it?','Where is the nearest authorised high-voltage service centre? How long are the waits? What is the towing arrangement?','Ask for a dated, written explanation of road-tax and subsidy eligibility in your state.','If you choose battery rental: ask for the rate, any monthly minimum, how long the loan runs, and what happens to it when you sell.','Ask about software updates and any known issues.','Is there a buyback or resale plan? Get the terms on paper.','Compare against a petrol car with similar features, not a cheaper trim.','Get an insurance quote and check that the battery is covered.'],
 drive:['Test the exact variant you plan to buy.','Sit in every seat. Check head room, leg room and the back seat.','Put your real luggage in the boot. Check for a spare tyre or repair kit.','Drive on a bad road to check suspension, noise and ground clearance.','Try the regeneration (slow-down) modes. Do they feel natural?','Try the brakes at city speed. EV brakes feel different at first.','Drive at your normal highway speed with the AC on. Check the efficiency (km per kWh) on the display.','Use the touchscreen while driving. Are the basics easy to reach?','Check where the charge port is against your parking spot.','Try the phone app: lock, climate, charging schedule.','Ask to see the charging cable and how the port lid opens.','If you can, drive it again on another day.'],
 home:['Ask a qualified electrician to inspect the supply, the distribution board and the cable route.','Check your sanctioned load and whether your electricity company needs to upgrade it.','Plan a dedicated circuit for the charger. No shared socket strips or extension reels.','Get the wire thickness and breakers sized for the charger and the cable length.','Get earthing tested and written down.','Fit the right overcurrent and earth-leakage (RCD) protection.','Use a weatherproof enclosure if outdoors. Protect the cable from being crushed or stretched.','Ask for tests of tripping, polarity, voltage drop and heat under load.','Keep the isolating switch easy to reach and labelled.','Get a commissioning record and the invoice.','Ask about a separate meter or a time-of-day tariff, and whether it helps you.','Run one full unattended charge to see that all is well.'],
 delivery:['Match the chassis number, manufacturing date, battery and motor variant to the invoice.','Inspect the body, wheels, tyres, underbody battery shield and panel gaps.','Test AC charging, and a short fast charge if you can.','Confirm the portable charger, wallbox, cable and accessories you were promised.','Check the battery percentage, range display, regeneration levels, driving modes and cameras.','Collect the warranty papers and the service contact.','Check the registration papers. Electric cars get a green number plate. Ask when the permanent registration card and plates will arrive.','Ask the dealer to show the charge-port emergency release.','Test the seat belts, safety systems and the 12-volt battery.','Install the maker’s app, link the car and check the connected features.','Keep copies of the charger invoice and any battery contract.'],
 public:['Check the plug type: most newer cars use CCS2 for fast charging. Confirm in your manual.','Check the operator app for live status, price, power and access.','Set up payment, and check your mobile network before you travel.','Know the next backup charger before you leave.','Park safely, switch off or select Park, then start the session and plug in firmly.','Check that charging starts, and watch the kW and the cost.','Never force a locked plug, and never use an unsafe adapter.','Stop the session, wait for the plug to release, and put the cable back neatly.','Watch for parking or idle fees.','Save the helpline number and the receipt.'],
 care:['Follow your maker’s advice for your battery type. There is no single rule for everyone.','For daily use many makers suggest keeping the charge limit at about 80%. Charge to full just before a long trip.','If your manual asks for a 100% charge now and then (some LFP batteries), follow it.','Avoid leaving the car parked at a full charge for long periods in heat, and avoid leaving it nearly empty for long.','Use scheduled charging, and park in shade in extreme heat.','Pre-condition the battery for fast charging if your car can.','Keep tyres, alignment and coolant on the recommended schedule.','Ask the service centre for a battery health check if you worry about capacity.','Install software updates the proper way, and check recall notices.','After a hard hit under the car or a flood, get an authorised inspection.'],
 first30:['Get your electrician to fit and test the charger before delivery day.','Install 3-4 charging apps and set up payment in each.','Set the car’s charge limit to about 80% for daily use, if your maker agrees.','Set a night charging schedule if your tariff is cheaper then.','Read the manual sections on the tyre kit, towing and the emergency release.','Note your first-week km per kWh to learn your real range.','Check tyre pressure every month, because it affects range.','Save the roadside-assistance number. Learn how the car must be towed.','Save the nearest fast charger and service centre in your phone.','Check the 12-volt battery. A weak one can stop the car even when the big battery is full.'],
 emergency:['If you see smoke, hear hissing, feel strong heat or smell something unusual: stop safely and get out.','Keep others away. Call 112 in India, or 101 for the fire service.','Tell the responders that it is an electric car.','Never touch orange high-voltage cables or damaged charging parts.','Never open the battery pack or try to repair high-voltage parts.','After a flood or deep water, do not charge or start the car. Call the maker.','Arrange recovery the way the maker says (usually a flatbed truck).','Keep the maker’s emergency guide in the car or on your phone.','If a charger looks damaged or hot, stay away and call the operator. Isolate it only if it is safe to do so.','After any accident that hit the battery area, get an authorised inspection and tell your insurer.']
};
var CHECK_TITLES={dealer:['Ask the dealer','Get answers in writing.'],drive:['On the test drive',''],home:['Home charging setup','Safety first. This is a job for a qualified electrician.'],delivery:['Delivery day',''],public:['Your first public fast charge',''],care:['Battery care',''],first30:['First 30 days',''],emergency:['In an emergency','Safety first.']};
function checklist(key,open){
  var saved=store('chk_'+key)||{}, t=CHECK_TITLES[key];
  return '<details class="chk"'+(open?' open':'')+'><summary><span>'+t[0]+'</span><span class="tiny muted" id="chk-n-'+key+'"></span></summary>'+(t[1]?'<p class="small muted" style="margin:0 0 8px">'+t[1]+'</p>':'')+'<ul class="checks" data-chk="'+key+'">'+CHECKS[key].map(function(x,i){
    return '<li><label><input type="checkbox" data-i="'+i+'"'+(saved[i]?' checked':'')+'> <span>'+x+'</span></label></li>'; }).join('')+'</ul></details>';
}
var SOURCES=[
 ['Range tests','Autocar India: every mass-market EV, real-world range tested','https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105'],
 ['Range tests','Autocar India: real-world charging times of all EVs tested in 2026','https://www.autocarindia.com/auto-features/real-world-charging-times-of-all-evs-tested-in-2026-441013'],
 ['Range tests','Autocar India: 2026 Tata Punch EV range test','https://www.autocarindia.com/auto-features/2026-tata-punch-ev-real-world-range-tested-explained-440983'],
 ['Range tests','Autocar India: Mahindra XEV 9S range test','https://www.autocarindia.com/auto-features/mahindra-xev-9s-real-world-range-tested-explained-440015'],
 ['Range tests','Autocar India: Hyundai Ioniq 5 range test (2026)','https://www.autocarindia.com/auto-features/2026-hyundai-ioniq-5-real-world-range-tested-explained-440980'],
 ['Range tests','Autocar India: Tesla Model Y RWD range test','https://www.autocarindia.com/auto-features/tesla-model-y-rwd-real-world-range-tested-explained-440915'],
 ['Owner ratings','CarWale: user ratings, one page per car (used for every star figure; links are on each car card)','https://www.carwale.com/new/electric-cars/'],
 ['Owner ratings','Cross-check: Autocar India user reviews, Mahindra XEV 9e (example)','https://www.autocarindia.com/cars/mahindra/xev-9e/user-reviews'],
 ['Owner ratings','Cross-check: CarDekho user reviews, Mahindra BE 6 (example)','https://www.cardekho.com/mahindra/be-6/user-reviews/13'],
 ['Owner ratings','Cross-check: 91wheels owner reviews, Mahindra XEV 9e (example)','https://www.91wheels.com/cars/mahindra/xev-9e/reviews'],
 ['Owner ratings','Cross-check: CarOnPhone ratings and reviews, Mahindra XEV 9e (example)','https://caronphone.com/mahindra-cars/xev-9e/rating-review'],
 ['Prices and specs','CarWale: electric cars in India','https://www.carwale.com/new/electric-cars/'],
 ['Prices and specs','ZigWheels: electric cars','https://www.zigwheels.com/newcars/electric-cars'],
 ['Prices and specs','Autocar India: every EV with battery rental (BaaS), listed','https://www.autocarindia.com/auto-features/all-evs-available-with-baas-battery-rental-scheme-listed-440264'],
 ['Safety','Autocar India: every car tested by Bharat NCAP so far','https://www.autocarindia.com/auto-features/every-car-tested-by-bharat-ncap-so-far-431936'],
 ['Tax and policy','EVSelect: EV tax benefits in India','https://www.evselect.in/blog/ev-tax-benefits-india'],
 ['Tax and policy','EVSelect: EV subsidy on electric cars in India','https://www.evselect.in/blog/ev-subsidy-on-electric-cars-india'],
 ['Charging','BEE EV Yatra: government charging portal','https://evyatra.beeindia.gov.in/'],
 ['Charging','Ministry of Power: EV charging infrastructure guidelines 2024 (PDF)','https://static.investindia.gov.in/s3fs-public/2024-10/guidelines_for_installation_and_operation_of_electric_vehicle_charging_infrastructure_2024.pdf'],
 ['Charging','Tata Power EZ Charge','https://www.tatapower.com/ezcharge'],
 ['Charging','PlugShare','https://www.plugshare.com/'],
 ['Owner experience','Team-BHP: electric cars forum','https://www.team-bhp.com/forum/electric-cars/'],
 ['Battery rental','Zee Business: Tata EV battery-as-a-service explained','https://www.zeebiz.com/automobile/news-tataev-baas-explained-pay-less-upfront-and-finance-the-battery-separately-what-it-means-for-buyers-402991']
];
function viewBuy(){
  var steps=[
   ['Know your use','How far do you drive in a day? How often do you take long trips? Where will you park at night? These three answers pick your car.','learn'],
   ['Check your parking and power','No place to charge near your parking spot? Fix that first. Ask your RWA or landlord for written permission.','charging'],
   ['Pick a price and range band','Use the car finder. Choose the smallest battery that covers your longest normal day plus a margin.','cars'],
   ['Compare 2-3 cars','Use the compare tray: price, tested range, fast-charge time, warranty and safety.','cars'],
   ['Test drive and ask questions','Use the checklists below. Drive the exact variant you want to buy.','buy'],
   ['Work out the money','Check your state’s road tax. Test own vs battery rental. Get insurance quotes.','money'],
   ['Install charging, then collect the car','Have the wiring checked before delivery day. Do not wait until the car arrives.','charging'],
   ['Your first 30 days','Learn your real range and set up charging habits. Use the checklist below.','buy']
  ];
  return ''+
  '<div class="intro"><div><div class="kicker">From first thought to first drive</div><h1>Buying guide</h1></div>'+
  '<p class="lead">Eight steps from “should I?” to “it is in my parking”. Tick off the checklists as you go. They are saved on this device.</p></div>'+
  '<section class="sec" id="by-road">'+secHead('','Your road to an EV','Eight steps','')+
  '<ol class="steps">'+steps.map(function(s,i){return '<li><div class="stone" aria-hidden="true"><i></i><b>'+(i+1)+'</b></div><div><h4>'+s[0]+'</h4><p class="small muted" style="margin:3px 0 6px">'+s[1]+'</p><button class="btn sm ghost" data-'+(s[2]==='buy'?'jump="by-lists"':'go="'+s[2]+'"')+'>'+(s[2]==='buy'?'See the checklists':'Open '+({learn:'Learn',charging:'Charging',cars:'Cars',money:'Money'})[s[2]])+'</button></div></li>';}).join('')+'</ol></section>'+

  '<section class="sec" id="by-lists">'+secHead('','Checklists','Take these to the showroom','Tap a heading to open it. Your ticks stay on this device only.')+
  '<div class="stack">'+['dealer','drive','home','delivery','public','first30','care','emergency'].map(function(k,i){return checklist(k,i===0);}).join('')+'</div></section>'+

  '<section class="sec" id="by-safety">'+secHead('','Safety','Crash test ratings','Bharat NCAP is India’s crash test. Higher stars mean better protection. Many new EVs have not been tested yet. Ask the dealer for the rating of the exact variant. Six airbags and stability control matter too.')+
  '<div class="tbl"><table><thead><tr><th>Car</th><th>Result found</th><th>Rating</th></tr></thead><tbody>'+SAFETY.map(function(s){return '<tr><td><b>'+s[0]+'</b></td><td>'+s[1]+'</td><td>'+pill(s[2].indexOf('5')>-1?'good':s[2]==='None found'?'':'info',s[2])+'</td></tr>';}).join('')+'</tbody></table></div></section>'+

  '<section class="sec" id="by-wait">'+secHead('','Wait or buy?','Cars coming soon','Dates are announced or reported, and can slip. A new launch often makes the older model cheaper or brings a better version.')+
  '<div class="grid" style="margin-bottom:14px">'+UPCOMING.map(function(u){return '<div class="card flat stack"><h3 data-vis="h4" style="font-size:19px">'+u[0]+'</h3><p class="small" style="margin:0"><b>When:</b> '+u[1]+'</p><p class="small" style="margin:0"><b>Price (a guess):</b> '+u[2]+'</p></div>';}).join('')+'</div>'+
  note('info','A simple rule','<p>If you need a car now, buy now. Waiting for a launch “just in case” can mean waiting forever. Wait only if a coming car is the exact one you want.</p>')+'</section>'+

  '<section class="sec" id="by-faq">'+secHead('','Questions','Common worries','')+
  [
   ['What if the battery runs out on the road?','This is rare if you plan. The car warns you for a long time before. If it happens, call the roadside service. EVs are usually moved on a flatbed truck. Never let it fall below 10% on a trip.'],
   ['How long does a battery last?','Most EV batteries lose a small amount each year. Makers warrant them for 8 years (often 1.6 lakh km). Charging to 80% daily and avoiding frequent fast charging helps.'],
   ['Is it safe to charge in the rain?','Yes. Charging equipment is built for it. Use certified chargers and never charge with wet hands or a damaged cable.'],
   ['Can I use an EV in a flood?','Avoid deep water, like with any car. Do not drive through water above the wheel centre. Ask the maker about the car’s water-wading depth.'],
   ['What does a battery replacement cost?','Out of warranty it can be a large amount, in lakhs. It is rare in the first 8 years. Ask about battery health tests and replacement of single modules.'],
   ['Can I take it on a long trip today?','Yes, on main highways, with planning. Use the Map tab’s planner and the charging apps. Plan stops at 10 to 80%.'],
   ['Will the AC drain my range?','A little. In summer city driving it costs a few percent. Pre-cool the car while it is plugged in.'],
   ['Is it good for a first car?','If you have home or office charging, yes. If you cannot charge near where you park, wait.']
  ].map(function(f){return '<details><summary>'+f[0]+'</summary><p class="small">'+f[1]+'</p></details>';}).join('')+'</section>'+

  '<section class="sec" id="by-src">'+secHead('','Be sure','How sure is this data?','')+
  '<div class="grid">'+
   '<div class="card stack"><h4>Confidence marks on cars</h4><div class="row" style="gap:8px">'+pill('good','High')+'<span class="small">Several sources agree, and range was tested.</span></div><div class="row" style="gap:8px">'+pill('warn','Medium')+'<span class="small">Some estimates or one source.</span></div><div class="row" style="gap:8px">'+pill('bad','Low')+'<span class="small">Conflicting or thin. Verify with the dealer.</span></div></div>'+
   '<div class="card stack"><h4>Where it comes from</h4><p class="small" style="margin:0">Car and price data was gathered on 10 November 2026 from maker pages, independent road tests, automobile and enthusiast sites and news reports, plus government sources for charging and policy. Real range comes from independent tests where they exist, and from clearly marked estimates elsewhere. The full list of links is below.</p></div>'+
   '<div class="card stack"><h4>What may have changed</h4><p class="small" style="margin:0">Prices, battery rental rates, state subsidies and charger counts change often. Fast-charge times and AC limits for some cars are estimates for that class of car. Always check the final number with the dealer.</p></div></div>'+
  '<h3 style="margin:22px 0 10px">Source library</h3><div class="tbl"><table><thead><tr><th>For</th><th>Source</th></tr></thead><tbody>'+SOURCES.map(function(r){return '<tr><td>'+r[0]+'</td><td><a href="'+r[2]+'" target="_blank" rel="noopener noreferrer">'+esc(r[1])+'</a></td></tr>';}).join('')+'</tbody></table></div>'+
  note('warn','Not financial advice','<p>This app is a guide for learning and comparing. It is not financial, legal or insurance advice, and it is not affiliated with any car maker or charging company.</p>')+'</section>';
}
function bindBuy(){
  $$('.checks').forEach(function(ul){
    var key=ul.getAttribute('data-chk');
    function upd(){ var all=$$('input',ul), n=all.filter(function(x){return x.checked;}).length; var el=document.getElementById('chk-n-'+key); if(el) el.textContent=n+' of '+all.length+' ticked'; }
    ul.addEventListener('change',function(e){ var st={}; $$('input',ul).forEach(function(x){ if(x.checked) st[x.getAttribute('data-i')]=1; }); store('chk_'+key,st); upd(); });
    upd();
  });
}
