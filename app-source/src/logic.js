/* ===== Pure calculation helpers (no DOM). Tested in Node before the page is built. ===== */
var LOSS = 0.10;           // share of wall electricity lost as heat while charging
var KPK = 6.5;             // typical real km per kWh (median of independently tested cars in this data, 6.45)
var ROAD_FACTOR = 1.15;    // straight-line distance to road distance

function kmhAdded(kw){ return Math.round(kw*(1-LOSS)*KPK/5)*5; } // range added per hour of AC charging, rounded to 5
function carById(id){ for (var i=0;i<CARS.length;i++) if (CARS[i].id===id) return CARS[i]; return null; }

function batClass(b){ return b<=30?'S':b<=45?'M':b<=60?'L':b<=80?'XL':b<=100?'P':'F'; }
var CLASS_LABEL = {S:'Up to 30 kWh',M:'30-45 kWh',L:'45-60 kWh',XL:'60-80 kWh',P:'80-100 kWh',F:'Over 100 kWh'};
function priceBand(p){ return p<10?'b1':p<15?'b2':p<25?'b3':p<50?'b4':p<100?'b5':'b6'; }
var BAND_LABEL = {b1:'Under ₹10 L',b2:'₹10-15 L',b3:'₹15-25 L',b4:'₹25-50 L',b5:'₹50 L-1 Cr',b6:'Over ₹1 Cr'};

function fmtLakh(x){
  if (x>=100){ var cr=x/100; var t=(cr<10?cr.toFixed(2):cr.toFixed(1)); if(t.indexOf('.')>-1) t=t.replace(/0+$/,'').replace(/\.$/,''); return '₹'+t+' Cr'; }
  return '₹'+(Math.round(x*100)/100).toString()+' L';
}
function fmtPrice(c){ return c.p[0]===c.p[1] ? fmtLakh(c.p[0]) : fmtLakh(c.p[0])+' to '+fmtLakh(c.p[1]); }
function fmtRs(x){ // plain rupees with Indian grouping
  x=Math.round(x); var neg=x<0; x=Math.abs(x); var s=x.toString(), last=s.slice(-3), rest=s.slice(0,-3);
  if (rest) rest=rest.replace(/\B(?=(\d{2})+(?!\d))/g,','), s=rest+','+last; return (neg?'-':'')+'₹'+s;
}

/* Electricity cost per km for a car at a given ₹/kWh. Uses the tested (or estimated) real range. */
function costPerKm(car, tariff){ if(!car||!car.re) return null; return car.bat*tariff/((1-LOSS)*car.re); }
function kmPerKwh(car){ return (car&&car.re)? car.re/car.bat : null; }

/* DC fast charging.
   Cars with measured times (car.m = [20-80% min, 80-100% min, test charger kW], from Autocar India) use them.
   Other cars: average power from the listed 10-80% time. The last 20% runs at about 28% of that speed;
   measured cars show 16-34% (mean about 28%). Charger power caps both zones at 92% of its rating. */
var TAIL = 0.28;
function dcPowers(car, chargerKw){
  var cap = chargerKw*0.92, pa, pt;
  if (car.m){ pa = 0.6*car.bat/(car.m[0]/60); pt = car.m[1] ? 0.2*car.bat/(car.m[1]/60) : pa*TAIL; }
  else { pa = 0.7*car.bat/(car.dc/60); pt = pa*TAIL; }
  return {pa:Math.min(pa,cap), pt:Math.min(pt,cap), carPa:pa};
}
function dcMinutes(car, fromPct, toPct, chargerKw){
  if(!car||!car.dc) return null;
  var w=dcPowers(car,chargerKw);
  var z1 = Math.max(0, Math.min(toPct,80)-Math.min(fromPct,80))/100*car.bat;
  var z2 = Math.max(0, toPct-Math.max(fromPct,80))/100*car.bat;
  return (z1/w.pa + z2/w.pt)*60;
}
function acHours(batKwh, fromPct, toPct, chargerKw, carAcKw){
  var kw = Math.min(chargerKw, carAcKw);
  return batKwh*Math.max(0,toPct-fromPct)/100/(kw*(1-LOSS));
}
function fmtDur(mins){
  if (mins==null||!isFinite(mins)) return '-';
  var r=Math.round(mins); if (r<60) return Math.max(1,r)+' min';
  var h=Math.floor(r/60), m=r%60;
  return h+' h'+(m?' '+m+' min':'');
}

/* ---- Battery rental (BaaS) versus buying ---- */
function emiRate(pv, emi, n){ // monthly rate that makes the loan fit; bisection
  if (emi*n<=pv) return 0; var lo=0, hi=0.05;
  for (var k=0;k<80;k++){ var mid=(lo+hi)/2, v=emi*(1-Math.pow(1+mid,-n))/mid; if (v>pv) lo=mid; else hi=mid; }
  return (lo+hi)/2;
}
function loanBalance(pv, emi, i, m){ if (i<1e-12) return Math.max(0,pv-emi*m); return pv*Math.pow(1+i,m) - emi*(Math.pow(1+i,m)-1)/i; }

/* o = {car, kmYear, years, moneyRate (annual, fraction), resalePct (fraction of price paid)}.
   Two views:  cash paid so far (simple chart)  and  a fair end-of-period cost that adds what your money
   could have earned and subtracts what the car sells for. */
function baasCompare(o){
  var b=o.car.baas, diff=(b.own-b.price)*1e5, r=o.moneyRate, out={type:b.type, diff:diff, car:o.car};
  var kmMonth=o.kmYear/12, rm=Math.pow(1+r,1/12)-1, resale=o.resalePct==null?0.5:o.resalePct;
  var cash, flows;   // flows(m) = BaaS payment in month m (1-based)
  if (b.type==='A'){
    var billed=Math.max(kmMonth,b.minKm||0); out.billedKm=billed; out.rentMonth=billed*b.perKm; out.minApplies = kmMonth<(b.minKm||0);
    out.breakEvenKm = diff/b.perKm; out.breakEvenYears = diff/b.perKm/Math.max(o.kmYear,1);
    out.breakEvenYearsBilled = diff/(out.rentMonth*12);
    flows=function(){ return out.rentMonth; };
    cash=function(y){ return b.price*1e5 + out.rentMonth*12*y; };
    out.exit=function(){ return 0; };
  } else {
    var emi=b.perKm*(b.basis||1800), n=96, i=emiRate(diff,emi,n);
    out.emi=emi; out.n=n; out.impliedAnnual=(Math.pow(1+i,12)-1); out.totalPaid=emi*n; out.i=i;
    out.incomplete = emi*n < diff;   // quoted payments add up to less than the battery's price: the real loan terms must differ
    flows=function(m){ return m<=n?emi:0; };
    out.exit=function(y){ var m=Math.round(y*12); return m>=n?0:loanBalance(diff,emi,i,m); };
    cash=function(y){ var m=Math.round(y*12); return b.price*1e5 + emi*Math.min(m,n) + out.exit(y); };
  }
  out.ownCash=function(){ return b.own*1e5; };
  out.baasCash=cash;
  out.crossYears=null;
  for (var m2=1;m2<=15*12;m2++){ var y=m2/12; if (cash(y)>b.own*1e5){ out.crossYears=y; break; } }
  // fair comparison at the chosen horizon
  var Y=o.years, M=Math.round(Y*12), g=Math.pow(1+rm,M);
  var ownFair=b.own*1e5*g - resale*b.own*1e5;
  var baasFair=b.price*1e5*g - resale*b.price*1e5;
  for (var m=1;m<=M;m++) baasFair += flows(m)*Math.pow(1+rm,M-m);
  baasFair += out.exit(Y);
  out.ownFair=ownFair; out.baasFair=baasFair; out.fairDiff=baasFair-ownFair; // positive: BaaS costs more
  out.exitBalanceAt=out.exit(Y);
  return out;
}

/* ---- EV vs petrol running cost ---- */
function runningCost(o){ // o: kmMonth, petrolPrice, petrolKmpl, evKmPerKwh, homeShare, homeTariff, dcTariff
  var petrol=o.kmMonth/o.petrolKmpl*o.petrolPrice;
  var perKm=(o.homeShare*o.homeTariff+(1-o.homeShare)*o.dcTariff)/((1-LOSS)*o.evKmPerKwh);
  var ev=o.kmMonth*perKm;
  return {petrol:petrol, ev:ev, evPerKm:perKm, petrolPerKm:petrol/o.kmMonth, save:petrol-ev};
}

/* ---- Map: projection fitted to the outline (Mercator, checked against Delhi, Chandigarh, Goa, Kanyakumari) ---- */
var MAP_W=612, MAP_H=696, LON0=68.16, MAP_K=611.9/(97.4-68.16);
function _merc(lat){ return Math.log(Math.tan(Math.PI/4+lat*Math.PI/360)); }
var _Y0=_merc(37.1), _KY=MAP_K*180/Math.PI;
function mapXY(lat,lon){ return [(lon-LON0)*MAP_K, (_Y0-_merc(lat))*_KY]; }
function haversine(a,b){
  var R=6371, toR=Math.PI/180, dLa=(b.la-a.la)*toR, dLo=(b.lo-a.lo)*toR;
  var h=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(a.la*toR)*Math.cos(b.la*toR)*Math.sin(dLo/2)*Math.sin(dLo/2);
  return 2*R*Math.asin(Math.sqrt(h));
}
var _adj=null;
function _buildGraph(){
  _adj={}; for (var k in NODES) _adj[k]=[];
  EDGES.forEach(function(e){ var d=haversine(NODES[e[0]],NODES[e[1]])*ROAD_FACTOR; _adj[e[0]].push({to:e[1],d:d,name:e[2]}); _adj[e[1]].push({to:e[0],d:d,name:e[2]}); });
}
function shortestPath(from,to){
  if(!_adj) _buildGraph();
  var dist={}, prev={}, done={}, q=[]; for (var k in NODES) dist[k]=Infinity; dist[from]=0; q.push(from);
  while(q.length){
    q.sort(function(a,b){return dist[a]-dist[b];}); var u=q.shift(); if(done[u]) continue; done[u]=1; if(u===to) break;
    _adj[u].forEach(function(e){ var nd=dist[u]+e.d; if(nd<dist[e.to]){dist[e.to]=nd; prev[e.to]={from:u,name:e.name,d:e.d}; q.push(e.to);} });
  }
  if(dist[to]===Infinity) return null;
  var path=[to], segs=[]; var c=to; while(c!==from){ var p=prev[c]; segs.unshift({a:p.from,b:c,d:p.d,name:p.name}); c=p.from; path.unshift(c); }
  return {nodes:path, segs:segs, km:dist[to]};
}
/* Place a point d km along the route: returns lat/lon and the nearest named node */
function pointAlong(route, d){
  var acc=0;
  for (var i=0;i<route.segs.length;i++){
    var s=route.segs[i];
    if (d<=acc+s.d || i===route.segs.length-1){
      var t=Math.max(0,Math.min(1,(d-acc)/s.d)), A=NODES[s.a], B=NODES[s.b];
      return {la:A.la+(B.la-A.la)*t, lo:A.lo+(B.lo-A.lo)*t, near:(t<0.5?A.nm:B.nm), corridor:s.name};
    }
    acc+=s.d;
  }
}
/* Trip plan: highwayFactor scales the tested (mixed) range down for steady 100+ km/h driving */
function tripPlan(o){ // o: car, km, startPct, factor, chargerKw, tariff
  var c=o.car; if(!c||!c.re||!c.dc) return {ok:false};
  var real=c.re*o.factor, usable=real*0.70, leg1=real*Math.max(0,(o.startPct-10)/100);
  var stops=0; if (o.km>leg1) stops=Math.ceil((o.km-leg1)/usable);
  var perStopMin=dcMinutes(c,10,80,o.chargerKw), plug=6;
  var chargeMin=stops*(perStopMin+plug);
  var energyDC = stops? Math.min(stops*0.7*c.bat, (o.km-leg1)/real*c.bat):0;
  return {ok:true, real:real, usable:usable, leg1:leg1, stops:stops, perStopMin:perStopMin, chargeMin:chargeMin,
          driveMin:o.km/75*60, totalMin:o.km/75*60+chargeMin, dcCost:energyDC/(1-LOSS)*o.tariff, energyDC:energyDC};
}

/* ---- Car finder score ---- */
function scoreCar(c,need){ // need: budget, seats, dailyKm, tripsPerMonth
  if (!c.re || c.p[0]>need.budget || c.seats<need.seats) return null;
  var must=Math.max(need.dailyKm*2.5,120); if (need.trips>0) must=Math.max(must,330); if (need.trips>=4) must=Math.max(must,400);
  var rangeS=Math.min(c.re/must,1.4)/1.4;
  var eff=Math.min((c.re/c.bat)/10,1);
  var value=Math.min((c.re/c.p[0])/45,1);
  var safety=/5★/.test(c.ncap)?1:(/Tested|Rated/.test(c.ncap)?0.8:0.45);
  var wr=/Lifetime|15 yr/.test(c.wr)?1:/8 yr/.test(c.wr)?0.65:0.4;
  var chg=c.dc? Math.max(0,Math.min(1,(70-c.dc)/50)) : 0;
  var wChg = need.trips>0 ? 0.14 : 0.06;
  var s=0.30*rangeS+0.18*eff+0.14*value+0.14*safety+0.10*wr+wChg*chg;
  var rw=c.rk==='T'?'Tested':'Estimated', why=[]; if (c.re>=must*1.15) why.push(rw+' range of '+c.re+' km covers your driving with room to spare');
  else if (c.re>=must) why.push(rw+' range of '+c.re+' km just covers your needs');
  else why.push(rw+' range of '+c.re+' km is short for your trips. Plan charging stops');
  if (/5★/.test(c.ncap)) why.push('5-star crash rating'); if (/Lifetime|15 yr/.test(c.wr)) why.push('Long battery warranty');
  if (eff>0.78) why.push('Very efficient ('+(c.re/c.bat).toFixed(1)+' km per kWh)');
  if (c.dc && c.dc<=25) why.push('Fast DC charging ('+(c.meas?'measured':c.dce?'class estimate':'maker figure')+': about '+c.dc+' min for 10-80%)');
  return {car:c, score:s, why:why, short:c.re<must};
}

/* Fast (DC) charging status of a car: has = can use a DC fast charger; tier by minutes for roughly 10-80% */
function fastInfo(c){
  if(!c.dc) return {has:false,tier:'none',label:'No fast charging',short:'AC only'};
  var t=c.dc<=30?'quick':c.dc<=45?'mid':'slow';
  return {has:true,tier:t,label:'Fast charging: about '+c.dc+' min for 10-80%',short:'about '+c.dc+' min',tierLabel:{quick:'Quick (30 min or less)',mid:'Moderate (31 to 45 min)',slow:'Slower (over 45 min)'}[t]};
}
/* Owner star ratings (CarWale). adj pulls a rating with few votes toward the middle (prior 4.3 worth 20 votes) so 5.0 from 2 votes never beats 4.7 from 380 */
var OWN_PRIOR=4.3, OWN_M=20;
function ownerInfo(c){
  if(!c.ur) return null;
  var r=c.ur[0], n=c.ur[1], lvl=n>=100?'many':n>=30?'some':n>=10?'few':'toofew';
  return {r:r,n:n,reviews:c.ur[2],lvl:lvl,lvlLabel:{many:'Many ratings',some:'Some ratings',few:'Few ratings',toofew:'Too few to judge'}[lvl],adj:(n*r+OWN_M*OWN_PRIOR)/(n+OWN_M),url:c.uu};
}
function stars(r){return '<span class="stars" aria-hidden="true" style="--p:'+Math.round(r/5*100)+'%">★★★★★</span>';}
if (typeof module!=='undefined') module.exports={ownerInfo:ownerInfo,stars:stars,fastInfo:fastInfo,kmhAdded:kmhAdded,LOSS:LOSS,KPK:KPK,dcPowers:dcPowers,TAIL:TAIL,costPerKm:costPerKm,dcMinutes:dcMinutes,acHours:acHours,emiRate:emiRate,loanBalance:loanBalance,baasCompare:baasCompare,runningCost:runningCost,mapXY:mapXY,shortestPath:shortestPath,pointAlong:pointAlong,tripPlan:tripPlan,scoreCar:scoreCar,fmtLakh:fmtLakh,fmtRs:fmtRs,fmtDur:fmtDur,batClass:batClass,priceBand:priceBand,carById:carById,haversine:haversine};
