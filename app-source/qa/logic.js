const fs=require('fs'),vm=require('vm');
const code=['data-cars','data-map','logic'].map(f=>fs.readFileSync(__dirname+'/../src/'+f+'.js','utf8')).join('\n');
const ctx={module:{exports:{}}}; vm.createContext(ctx); vm.runInContext(code+';this.CARS=CARS;this.NODES=NODES;this.PICKS=PICKS;',ctx);
const L=ctx.module.exports,{CARS,NODES}=ctx; let fails=0,n=0;
const ok=(c,m)=>{n++; if(!c){fails++;console.log('FAIL',m);}};
const near=(a,b,t)=>Math.abs(a-b)<=t;
const fin=(...v)=>v.every(x=>typeof x==='number'&&isFinite(x));
// --- formatters
ok(L.fmtRs(0)==='₹0','fmtRs 0'); ok(L.fmtRs(999)==='₹999','fmtRs 999'); ok(L.fmtRs(1000)==='₹1,000','fmtRs 1k'); ok(L.fmtRs(123456)==='₹1,23,456','fmtRs lakh'); ok(L.fmtRs(12345678)==='₹1,23,45,678','fmtRs crore'); ok(L.fmtRs(-52000)==='-₹52,000','fmtRs neg'); ok(L.fmtRs(99999.6)==='₹1,00,000','fmtRs round');
ok(L.fmtLakh(6.99)==='₹6.99 L','lakh'); ok(L.fmtLakh(99.5)==='₹99.5 L','lakh 99.5'); ok(L.fmtLakh(100)==='₹1 Cr','cr 100'); ok(L.fmtLakh(122)==='₹1.22 Cr','cr'); ok(L.fmtLakh(750)==='₹7.5 Cr','cr 7.5');
ok(L.fmtDur(0.2)==='1 min','dur 0.2'); ok(L.fmtDur(59.4)==='59 min','dur 59'); ok(L.fmtDur(59.6)==='1 h','dur 59.6 rolls to 1 h'); ok(L.fmtDur(125)==='2 h 5 min','dur 125'); ok(L.fmtDur(NaN)==='-','dur NaN'); ok(L.fmtDur(null)==='-','dur null');
// --- charging model vs measured data
CARS.filter(c=>c.m).forEach(c=>{ ok(near(L.dcMinutes(c,20,80,c.m[2]),c.m[0],1.5),'20-80 '+c.id); if(c.m[1]) ok(near(L.dcMinutes(c,80,100,c.m[2]),c.m[1],2),'80-100 '+c.id); });
CARS.filter(c=>c.dc).forEach(c=>{
  const t=(a,b,k)=>L.dcMinutes(c,a,b,k);
  ok(fin(t(10,80,60),t(0,100,240),t(80,100,30)),'fin '+c.id);
  ok(t(10,80,240)<=t(10,80,30)+1e-9,'faster charger never slower '+c.id); ok(t(10,80,240)<=t(10,80,60)+1e-9,'faster charger 240<=60 '+c.id);
  ok(t(20,80,120)<t(10,80,120),'wider window takes longer '+c.id); ok(t(10,100,120)>t(10,80,120),'100 longer than 80 '+c.id);
  ok(near(t(10,50,120)+t(50,80,120),t(10,80,120),0.01),'additive '+c.id); ok(t(40,40,120)===0,'zero window '+c.id);
  ok(t(80,100,120)>t(60,80,120)*0.9||c.m,'tail slower '+c.id+' '+t(80,100,120).toFixed(1)+' vs '+t(60,80,120).toFixed(1));
});
// AC
ok(near(L.acHours(60,20,80,7.4,11),60*0.6/(7.4*0.9),1e-9),'ac basic'); ok(near(L.acHours(60,20,80,22,7.4),L.acHours(60,20,80,7.4,7.4),1e-9),'ac car limit'); ok(L.acHours(60,50,50,7,7)===0,'ac zero'); ok(L.acHours(60,80,20,7,7)===0,'ac reverse clamps to 0');
// kmh helper
ok(L.kmhAdded(7.4)===45&&L.kmhAdded(3.3)===20&&L.kmhAdded(11)===65,'kmh values '+[2.3,3.3,7.4,11].map(L.kmhAdded));
// --- cost
CARS.filter(c=>c.re).forEach(c=>{ const x=L.costPerKm(c,8); ok(fin(x)&&x>0.4&&x<6,'cost/km '+c.id+' '+x); ok(L.costPerKm(c,16)/L.costPerKm(c,8)>1.99&&L.costPerKm(c,16)/L.costPerKm(c,8)<2.01,'linear in tariff '+c.id); });
ok(L.costPerKm({bat:40,re:null},8)===null,'cost null');
// running cost
{ const r=L.runningCost({kmMonth:1200,petrolPrice:100,petrolKmpl:15,evKmPerKwh:7,homeShare:1,homeTariff:8,dcTariff:24}); ok(near(r.petrol,8000,1e-6),'petrol'); ok(near(r.ev,1200*8/(0.9*7),1e-6),'ev home'); ok(near(r.save,r.petrol-r.ev,1e-9),'save');
  const r2=L.runningCost({kmMonth:1200,petrolPrice:100,petrolKmpl:15,evKmPerKwh:7,homeShare:0,homeTariff:8,dcTariff:24}); ok(r2.ev>r.ev*2.9&&r2.ev<r.ev*3.1,'dc triples cost'); }
// --- BaaS maths
const bc=(id,k,y,r,rs)=>L.baasCompare({car:L.carById(id),kmYear:k,years:y,moneyRate:r,resalePct:rs});
CARS.filter(c=>c.baas).forEach(c=>{ [[5000,3,0],[12000,6,0.07],[25000,10,0.12],[40000,1,0.05]].forEach(([k,y,r])=>{ const o=bc(c.id,k,y,r,0.4);
   ok(fin(o.ownFair,o.baasFair,o.fairDiff,o.diff),'baas finite '+c.id+' '+[k,y,r]); ok(typeof o.baasCash==='function'&&fin(o.baasCash(y)),'cash '+c.id);
   ok(o.baasCash(0)>=c.baas.price*1e5-1,'cash(0)>=price '+c.id);
   if(c.baas.type==='A'){ ok(o.rentMonth>=Math.max(k/12,c.baas.minKm)*c.baas.perKm-1e-6,'rent>=min '+c.id); ok(o.baasCash(10)>o.baasCash(5),'cash grows '+c.id); const hi=bc(c.id,k*2,y,r,0.4); ok(hi.fairDiff>=o.fairDiff-1e-6,'more km never helps BaaS A '+c.id); }
   else { ok(o.incomplete===['creta','be6','xev9e','xev9s'].includes(c.id),'incomplete flag only for known inconsistent quotes '+c.id); ok(o.incomplete? o.impliedAnnual===0 : (o.impliedAnnual>0&&o.impliedAnnual<0.2),'implied rate '+c.id+' '+(o.impliedAnnual*100).toFixed(1)); ok(near(o.exit(8),0,1),'loan zero at 8y '+c.id); ok(o.exit(0)>=o.exit(3)&&o.exit(3)>o.exit(6),'loan declines '+c.id); const hi=bc(c.id,k*2,y,r,0.4); ok(near(hi.fairDiff,o.fairDiff,1),'type B ignores km '+c.id); }
 });
 // r=0, closed form
 const z=bc(c.id,12000,5,0,0.5), b=c.baas, own=b.own*1e5, price=b.price*1e5; let paid;
 if(b.type==='A') paid=Math.max(1000,b.minKm||0)*b.perKm*60; else paid=Math.min(60,96)*b.perKm*(b.basis||1800)+z.exit(5);
 ok(near(z.fairDiff,(price+paid-0.5*price)-(own-0.5*own),2),'closed form r=0 '+c.id+' '+z.fairDiff+' vs '+((price+paid-0.5*price)-(own-0.5*own)));
});
// Report's headline numbers
{ const w=bc('windsor',10000,6,0.07,0.5); ok(near(w.breakEvenKm,113023,50),'windsor break-even km'); ok(near(w.breakEvenYears,11.3,0.05),'windsor 11.3 yrs at 10k'); const w15=bc('windsor',15000,6,0.07,0.5); ok(near(w15.breakEvenYears,7.5,0.05),'7.5 yrs'); const w20=bc('windsor',20000,6,0.07,0.5); ok(near(w20.breakEvenYears,5.7,0.05),'5.7 yrs');
  ok(near(w.rentMonth,6450,1)&&w.minApplies,'windsor min 1500 km => 6450'); const nx=bc('nexon',12000,6,0.07,0.5); ok(near(nx.emi,7920,1),'nexon emi 7920'); ok(near(nx.totalPaid,760320,1),'nexon total 7.6L'); ok(near(nx.impliedAnnual*100,9.7,0.3),'nexon ~9.5-9.7%');
  const e=bc('ec3',12000,6,0.07,0.5); ok(near(e.rentMonth,4520,1),'ec3 min 2000 => 4520'); ok(near(e.breakEvenKm,226000,500),'ec3 break-even 2.26 lakh km'); const cm=bc('comet',10000,6,0.07,0.5); ok(near(cm.breakEvenKm,87813,100),'comet ~88000 km'); }
// --- routes
const known=[['delhi','jaipur',280],['delhi','agra',230],['mumbai','pune',150],['bengaluru','chennai',345],['mumbai','ahmedabad',530],['hyderabad','bengaluru',570],['delhi','chandigarh',245],['chennai','hyderabad',625],['kolkata','bhubaneswar',440],['delhi','mumbai',1400],['vadodara','mumbai',420],['bengaluru','mysuru',150],['pune','hyderabad',560],['delhi','lucknow',555],['nagpur','hyderabad',500]];
known.forEach(([a,b,d])=>{ if(!NODES[a]||!NODES[b]){ console.log('skip',a,b); return; } const r=L.shortestPath(a,b); ok(r&&near(r.km,d,d*0.14),`route ${a}-${b}: ${r&&Math.round(r.km)} vs ~${d}`); ok(near(L.shortestPath(b,a).km,r.km,0.01),'symmetric '+a+b); });
const ks=Object.keys(NODES); let bad=0; for(let i=0;i<ks.length;i+=3) for(let j=0;j<ks.length;j+=4){ if(i===j) continue; const r=L.shortestPath(ks[i],ks[j]); if(!r||!fin(r.km)||r.km<=0){bad++;} else { const direct=L.haversine(NODES[ks[i]],NODES[ks[j]]); if(r.km<direct*0.99) {bad++; console.log('shorter than straight line',ks[i],ks[j]);} const p0=L.pointAlong(r,0),p1=L.pointAlong(r,r.km),pm=L.pointAlong(r,r.km/2); if(!(p0&&p1&&pm&&fin(pm.la,pm.lo))) bad++; } } ok(bad===0,'all-pairs route sanity, bad='+bad);
// triangle inequality sample
ok(L.shortestPath('delhi','chennai').km<=L.shortestPath('delhi','bengaluru').km+L.shortestPath('bengaluru','chennai').km+0.01,'triangle');
// --- trip planner
const cr=L.carById('creta');
const tp=(o)=>L.tripPlan(Object.assign({car:cr,km:500,startPct:90,factor:0.85,chargerKw:120,tariff:24},o));
ok(tp({km:100}).stops===0,'short trip 0 stops'); ok(tp({km:1000}).stops>=tp({km:500}).stops,'longer more stops'); ok(tp({startPct:100}).stops<=tp({startPct:30}).stops,'fuller start fewer stops'); ok(tp({factor:0.65}).stops>=tp({factor:1}).stops,'worse range more stops');
ok(tp({chargerKw:240}).chargeMin<=tp({chargerKw:30}).chargeMin,'faster charger less time'); ok(!L.tripPlan({car:L.carById('comet'),km:100,startPct:90,factor:0.85,chargerKw:60,tariff:24}).ok,'AC-only car not plannable');
for(let km=10;km<=3000;km+=70) for(const s of [30,60,100]) for(const f of [0.65,0.85,1]){ const t=tp({km,startPct:s,factor:f}); ok(fin(t.totalMin,t.dcCost,t.stops),'tp finite '+[km,s,f]); ok(t.totalMin>=km/75*60-1e-6,'time>=drive '+[km,s,f]); if(t.stops===0) ok(km<=t.leg1+1e-6,'no stop only if within first leg'); else ok(t.leg1+t.stops*t.usable>=km-1e-6,'enough stops to finish '+[km,s,f]); }
// --- scoring
const sc=(c,o)=>L.scoreCar(c,o);
for(const b of [8,12,20,30,60,300,1000]) for(const seats of [4,6]) for(const d of [10,60,200]) for(const t of [0,1,4,8]){ CARS.forEach(c=>{ const r=sc(c,{budget:b,seats,dailyKm:d,trips:t}); if(r){ ok(fin(r.score),'score finite '+c.id); ok(c.p[0]<=b,'score respects budget '+c.id); ok(seats<6||c.seats>=6,'score respects seats '+c.id); } }); }
// --- projection sanity (Delhi, Chandigarh, Goa, Kanyakumari-ish)
[['delhi'],['mumbai'],['chennai'],['kolkata'],['guwahati']].forEach(([k])=>{ const n=NODES[k]; if(!n) return; const [x,y]=L.mapXY(n.la,n.lo); ok(x>0&&x<612&&y>0&&y<696,'inside map '+k+' '+[x,y]); });
// ordering sanity: east is larger x, north is smaller y
{const d=L.mapXY(NODES.delhi.la,NODES.delhi.lo),c=L.mapXY(NODES.chennai.la,NODES.chennai.lo),m=L.mapXY(NODES.mumbai.la,NODES.mumbai.lo),k=L.mapXY(NODES.kolkata.la,NODES.kolkata.lo); ok(d[1]<m[1]&&m[1]<c[1],'north-south order'); ok(m[0]<d[0]&&d[0]<k[0],'west-east order');}
// batClass / priceBand
ok(L.batClass(30)==='S'&&L.batClass(30.1)==='M'&&L.batClass(100)==='P'&&L.batClass(100.1)==='F','batClass edges'); ok(L.priceBand(9.99)==='b1'&&L.priceBand(10)==='b2'&&L.priceBand(100)==='b6','priceBand edges');
console.log(`LOGIC QA: ${n} checks, ${fails} fail`); process.exit(fails?1:0);
