/* ===== MONEY tab: tax, running cost, battery rental vs buying ===== */
function viewMoney(){
  var baasCars=CARS.filter(function(c){return c.baas;});
  var bo=baasCars.map(function(c){return '<option value="'+c.id+'"'+(c.id==='windsor'?' selected':'')+'>'+esc(c.br+' '+c.nm)+' — '+(c.baas.type==='A'?'₹'+c.baas.perKm+'/km':'₹'+c.baas.perKm+'/km (loan)')+'</option>';}).join('');
  return ''+
  '<div class="intro"><div><div class="kicker">Price, tax, running cost, battery rental</div><h1>The money side</h1></div>'+
  '<p class="lead">What you actually pay today, what you save every month, and whether battery rental is a good deal.</p></div>'+
  '<div class="jump">'+[['mo-tax','Tax and price'],['mo-run','Running cost'],['mo-baas','Battery rental'],['mo-buyback','Buyback plans'],['mo-extra','Other costs']].map(function(j){return '<button class="chip" data-jump="'+j[0]+'">'+j[1]+'</button>';}).join('')+'</div>'+

  '<section class="sec" id="mo-tax">'+secHead('','Tax and price','Why the price on the website is not what you pay','')+
  '<div class="cols2"><div class="stack">'+
   '<div class="card"><h3 style="margin-bottom:8px">GST is lower on EVs</h3><div class="tbl"><table><thead><tr><th>Car type</th><th class="r">GST</th></tr></thead><tbody><tr><td>Electric car</td><td class="n r">5%</td></tr><tr><td>Petrol or diesel car (small)</td><td class="n r">18%</td></tr><tr><td>Bigger petrol or diesel (SUV, luxury)</td><td class="n r">40%</td></tr></tbody></table></div><p class="tiny muted" style="margin:8px 0 0">Plus a few smaller charges. Check with your dealer for your exact car.</p></div>'+
   note('warn','No central subsidy for private cars','<p>The central government scheme (PM E-DRIVE) helps buses, trucks, two-wheelers, three-wheelers and charging points. It does not give cash back on private electric cars. Any subsidy for you comes from your state.</p>')+
   note('info','On-road price','<p>Your on-road price is the ex-showroom price plus registration, road tax, insurance and fees. On EVs, road tax is often waived, which can save you lakhs. Ask for a written on-road quote for your own city.</p>')+
  '</div><div class="tbl"><table><thead><tr><th>State</th><th>Road tax and incentives (Nov 2026)</th></tr></thead><tbody>'+STATES.map(function(s){return '<tr><td><b>'+s[0]+'</b></td><td>'+pill(s[2]==='good'?'good':s[2]==='warn'?'warn':'', s[2]==='good'?'Waiver':s[2]==='warn'?'Tax applies':'Check')+' '+esc(s[1])+'</td></tr>';}).join('')+'</tbody></table></div></div></section>'+

  '<section class="sec" id="mo-run">'+secHead('','Running cost','How much will you save each month?','Enter how you drive. The result compares electricity with petrol. EVs usually cost about ₹1-1.5 per km at home; petrol costs ₹6-8.')+
  '<div class="cols2"><div class="card"><div class="fgrid" style="grid-template-columns:1fr">'+
   '<div class="field"><label for="r-car">Electric car</label><select id="r-car">'+carOptions(function(c){return c.re;},'nexon')+'</select></div>'+
   '<div class="field"><div class="lab">Driving per month</div><div class="val" id="r-kv"></div><input type="range" id="r-k" min="200" max="4000" step="100" value="1200" aria-label="Kilometres per month"></div>'+
   '<div class="field"><div class="lab">Charged at home</div><div class="val" id="r-hv"></div><input type="range" id="r-h" min="0" max="100" step="5" value="80" aria-label="Percent charged at home"></div>'+
   '<div class="field"><label for="r-ht">Home price (₹ per kWh)</label><input type="number" id="r-ht" value="8" min="2" max="20" step="0.5"></div>'+
   '<div class="field"><label for="r-dt">Public fast-charge price (₹ per kWh)</label><input type="number" id="r-dt" value="24" min="10" max="40" step="1"></div>'+
   '<div class="field"><label for="r-pp">Petrol price (₹ per litre)</label><input type="number" id="r-pp" value="100" min="60" max="130" step="1"></div>'+
   '<div class="field"><label for="r-pk">Petrol car mileage (km per litre)</label><input type="number" id="r-pk" value="15" min="8" max="30" step="1"></div>'+
   '<div class="field"><label for="r-pr">Extra price of the EV over the petrol car (₹ lakh)</label><input type="number" id="r-pr" value="3" min="0" max="30" step="0.5"></div>'+
  '</div></div><div class="card stack" id="r-out" aria-live="polite"></div></div></section>'+

  '<section class="sec" id="mo-baas">'+secHead('','Battery as a Service (BaaS)','Should you rent the battery?','With BaaS you buy the car without the battery, so the sticker price is much lower. You then pay for the battery by the kilometre, or as a fixed loan. Test it with your own numbers.')+
  '<div class="cols2"><div class="card"><div class="fgrid" style="grid-template-columns:1fr">'+
   '<div class="field"><label for="b-car">Car</label><select id="b-car">'+bo+'</select></div>'+
   '<div class="field"><div class="lab">Driving per year</div><div class="val" id="b-kv"></div><input type="range" id="b-k" min="3000" max="40000" step="1000" value="12000" aria-label="Kilometres per year"></div>'+
   '<div class="field"><div class="lab">Keep the car for</div><div class="val" id="b-yv"></div><input type="range" id="b-y" min="1" max="10" step="1" value="6" aria-label="Years of ownership"></div>'+
   '<div class="field"><div class="lab">What your money could earn each year</div><div class="val" id="b-rv"></div><input type="range" id="b-r" min="0" max="12" step="0.5" value="7" aria-label="Yearly return percent"></div>'+
   '<div class="field"><div class="lab">Resale value at the end, share of price</div><div class="val" id="b-sv"></div><input type="range" id="b-s" min="20" max="70" step="5" value="45" aria-label="Resale percent"></div>'+
  '</div></div><div class="stack" id="b-out" aria-live="polite"></div></div>'+
  '<div class="card" style="margin-top:14px"><h4 style="margin-bottom:4px">Total cash paid over the years</h4><p class="small muted" style="margin:0 0 8px">Own: pay the full price once. Rent: pay the lower price, plus the battery charges. This is cash only; the verdict above also counts what your money could earn and the resale value.</p><div id="b-chart"></div>'+
   '<div class="maplegend" style="margin-top:6px"><span><svg width="26" height="10"><line x1="1" y1="5" x2="25" y2="5" stroke="var(--s1)" stroke-width="3"/></svg>Own the battery</span><span><svg width="26" height="10"><line x1="1" y1="5" x2="25" y2="5" stroke="var(--s2)" stroke-width="3"/></svg>Rent the battery</span></div></div>'+
  '<div class="grid" style="margin-top:14px">'+
   '<div class="card stack"><h4>Two kinds of plans</h4><p class="small" style="margin:0"><b>Pay per km</b> (MG, Citroën): you pay a rate for every km you drive, usually with a minimum of 1,500-2,000 km a month billed. <b>Fixed loan</b> (Tata, Mahindra, others): the battery is a loan of up to 8 years (96 months) at about ₹/km × 1,800 km a month. You pay it whether you drive or not.</p></div>'+
   '<div class="card stack"><h4>Who may like it</h4><p class="small" style="margin:0">Someone who wants the lowest upfront price, drives little, and may sell the car in a few years. It also helps if loan money is tight.</p></div>'+
   '<div class="card stack"><h4>Who should skip it</h4><p class="small" style="margin:0">Someone who drives a lot (above ~15,000 km a year), plans to keep the car for 8+ years, or does not like extra paperwork when selling.</p></div></div>'+
  note('warn','Small print to ask about','<ul><li>BaaS is mostly for personal use only (Tata, Mahindra, Maruti). Taxi use is usually not allowed.</li><li>Insurance (IDV) is usually on the full car price, not the lower sticker price.</li><li>Ask what happens to the battery loan or rental when you sell the car.</li><li>Rates have changed more than once (MG Windsor was quoted at both ₹3.99 and ₹4.3 per km). Get the current rate in writing.</li><li>With two loans (car and battery), read both agreements.</li></ul>')+'</section>'+

  '<section class="sec" id="mo-buyback">'+secHead('','Selling later','Buyback plans','Some makers promise a minimum resale price. Read the conditions: they depend on years, distance and condition.')+
  '<div class="tbl"><table><thead><tr><th>Maker</th><th>What was announced</th></tr></thead><tbody>'+[
   ['Maruti Suzuki','Up to 60% of the price after 3 years or 45,000 km. About 50% after 4 years or 60,000 km.'],
   ['MG (Value Promise)','Between 40% and 60% buyback, depending on the plan and when you sell.'],
   ['Hyundai','A buyback plan was launched in August 2026. Ask the dealer for the written terms.'],
   ['Tata, Mahindra','Battery rental or loan plans for personal use. No fixed resale guarantee found.']
  ].map(function(r){return '<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td></tr>';}).join('')+'</tbody></table></div></section>'+

  '<section class="sec" id="mo-extra">'+secHead('','Other costs','Costs people forget','')+
  '<div class="grid">'+[
   ['Insurance','Often 3-4% of the price each year. Higher for costly cars. Ask for a quote with “battery cover” included.'],
   ['Servicing','Lower than petrol: no engine oil, fewer parts. Budget for tyres, brakes, coolant and cabin filter.'],
   ['Home charger','A one-time cost for the wallbox, wiring and a proper breaker. Get a written quote that includes installation and testing.'],
   ['Tyres','EVs are heavy and quick. Tyres can wear faster, so check the cost.'],
   ['Battery warranty','Most brands give 8 years or 1.6 lakh km on the battery. Read what counts as “healthy”.'],
   ['Resale','EV resale values are still settling. A used EV is often a bargain, but you should check the battery health report.']
  ].map(function(r){return '<div class="card stack"><h4>'+r[0]+'</h4><p class="small" style="margin:0">'+r[1]+'</p></div>';}).join('')+'</div></section>';
}
function bindMoney(){
  function run(){
    var c=carById($('#r-car').value), k=num('r-k',1200), h=num('r-h',80); $('#r-kv').textContent=k+' km';  $('#r-hv').textContent=h+'%';
    var r=runningCost({kmMonth:k,petrolPrice:num('r-pp',100),petrolKmpl:num('r-pk',15),evKmPerKwh:c.re/c.bat,homeShare:h/100,homeTariff:num('r-ht',8),dcTariff:num('r-dt',24)});
    var prem=num('r-pr',3)*1e5, pay= r.save>0? prem/(r.save*12) : null;
    var max=Math.max(r.petrol,r.ev);
    $('#r-out').innerHTML=
      '<h3>Every month</h3>'+
      '<div class="rbar"><div class="lab">Petrol</div><div class="bar"><i style="width:'+(r.petrol/max*100)+'%;background:var(--s2)"></i></div><div class="num">'+fmtRs(r.petrol)+'</div></div>'+
      '<div class="rbar"><div class="lab">'+esc(c.nm)+'</div><div class="bar"><i style="width:'+(r.ev/max*100)+'%;background:var(--s1)"></i></div><div class="num">'+fmtRs(r.ev)+'</div></div>'+
      '<div class="row" style="gap:22px"><div class="stat"><div class="v">'+fmtRs(r.save)+'</div><div class="l">Saved per month</div></div><div class="stat"><div class="v">'+fmtRs(r.save*12)+'</div><div class="l">Saved per year</div></div><div class="stat"><div class="v">₹'+r.evPerKm.toFixed(2)+'</div><div class="l">EV per km (petrol ₹'+r.petrolPerKm.toFixed(2)+')</div></div></div>'+
      (pay? note(pay<=5?'good':pay<=9?'warn':'bad','Payback',  '<p>The extra price of ₹'+(prem/1e5)+' L comes back in about <b>'+pay.toFixed(1)+' years</b> from fuel savings alone.'+(pay>8?' That is long. Look at the cheaper end of the market, or consider whether road-tax savings change this.':'')+'</p>') : note('bad','No saving','<p>With these numbers the EV does not save money on fuel. Try more home charging.</p>'))+
      '<p class="tiny muted" style="margin:0">Uses '+(c.re/c.bat).toFixed(1)+' km per kWh ('+(c.rk==='T'?'tested':'estimated')+' real range) and '+Math.round(LOSS*100)+'% charging loss. Servicing and insurance not included.</p>';
  }
  ['r-car','r-k','r-h','r-ht','r-dt','r-pp','r-pk','r-pr'].forEach(function(id){ document.getElementById(id).addEventListener('input',run); }); run();

  function baas(){
    var c=carById($('#b-car').value), k=num('b-k',12000), y=num('b-y',6), r=num('b-r',7), s=num('b-s',45);
    $('#b-kv').textContent=k.toLocaleString('en-IN')+' km'; $('#b-yv').textContent=y+' years'; $('#b-rv').textContent=r+'%'; $('#b-sv').textContent=s+'%';
    var o=baasCompare({car:c,kmYear:k,years:y,moneyRate:r/100,resalePct:s/100}), b=c.baas, h='';
    h+='<div class="card stack"><h3>'+esc(c.br+' '+c.nm)+' <span class="small muted" style="font-weight:400">('+esc(b.variant)+')</span></h3>'+
      '<div class="row" style="gap:22px"><div class="stat"><div class="v">'+fmtLakh(b.own)+'</div><div class="l">Own price</div></div><div class="stat"><div class="v">'+fmtLakh(b.price)+'</div><div class="l">Price without battery</div></div><div class="stat"><div class="v">'+fmtLakh(o.diff/1e5)+'</div><div class="l">You save upfront</div></div></div>';
    if(b.type==='A'){
      h+='<p class="small" style="margin:0">You pay ₹'+b.perKm+' per km. Billed at least '+b.minKm.toLocaleString('en-IN')+' km a month. Your driving is '+Math.round(k/12).toLocaleString('en-IN')+' km a month'+(o.minApplies?', so you are billed for the minimum: <b>'+fmtRs(o.rentMonth)+' a month</b>.':': <b>'+fmtRs(o.rentMonth)+' a month</b>.')+'</p>'+
        '<div class="tinted small">Rent matches the upfront saving after about <b>'+Math.round(o.breakEvenKm).toLocaleString('en-IN')+' km</b> of billed driving, which is <b>'+o.breakEvenYearsBilled.toFixed(1)+' years</b> at your pace.</div>';
    } else {
      h+='<p class="small" style="margin:0">The battery is a loan of '+o.n+' months. EMI about <b>'+fmtRs(o.emi)+' a month</b> (₹'+b.perKm+' × '+(b.basis||1800)+' km), whether you drive or not. Total paid: '+fmtRs(o.totalPaid)+'. '+(o.incomplete?'':'The loan costs about <b>'+(o.impliedAnnual*100).toFixed(1)+'% a year</b>.')+'</p>'+(o.incomplete?'<div class="note warn"><span class="lbl">Numbers do not add up</span><p>These payments total '+fmtRs(o.totalPaid)+', which is less than the battery’s price of '+fmtRs(o.diff)+'. The real loan must run longer, or have other terms. Ask the dealer for the full loan terms before you trust the verdict below.</p></div>':'')+
        ((y*12<o.n)? '<div class="tinted small">If you sell at year '+y+', about <b>'+fmtRs(o.exitBalanceAt)+'</b> of battery loan is still due.</div>':'');
    }
    h+='</div>';
    var d=o.fairDiff, win=Math.abs(d)<25000?'even':d>0?'own':'rent';
    h+=note(win==='even'?'info':win==='own'?'good':'warn','Verdict for your numbers', win==='even'?'<p>About equal. The difference is under ₹25,000 over '+y+' years. Choose by comfort: lower upfront payment (rent) or one simple purchase (own).</p>': win==='own'?'<p><b>Owning is cheaper</b> by about <b>'+fmtRs(d)+'</b> over '+y+' years. Renting the battery costs more in total.</p>':'<p><b>Renting the battery is cheaper</b> by about <b>'+fmtRs(-d)+'</b> over '+y+' years.</p>');
    h+='<p class="tiny muted" style="margin:0">The verdict adds what your money could earn, and subtracts the resale value (which is a share of the price you paid for the car). It is a guide, not a quote.</p>';
    $('#b-out').innerHTML=h;
    var maxY=Math.max(y,8), ch=lineChart('bch',[{name:'Own',color:'var(--s1)',f:function(t){return o.ownCash();}},{name:'Rent',color:'var(--s2)',f:function(t){return o.baasCash(t);}}],maxY);
    $('#b-chart').innerHTML=ch.svg; ch.bind();
  }
  ['b-car','b-k','b-y','b-r','b-s'].forEach(function(id){ document.getElementById(id).addEventListener('input',baas); }); baas();
}
