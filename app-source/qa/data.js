// Data QA: structure, ranges, cross-checks against the research report and measured tests
const fs=require('fs'),vm=require('vm');
const code=['data-cars','data-map','logic'].map(f=>fs.readFileSync(__dirname+'/../src/'+f+'.js','utf8')).join('\n');
const ctx={module:{exports:{}}}; vm.createContext(ctx); vm.runInContext(code+';this.CARS=CARS;this.PICKS=PICKS;this.STATES=STATES;this.SAFETY=SAFETY;this.UPCOMING=UPCOMING;this.NODES=NODES;this.EDGES=EDGES;this.NETWORKS=NETWORKS;',ctx);
const {CARS,PICKS,STATES,SAFETY,UPCOMING,NODES,EDGES,NETWORKS}=ctx; const L=ctx.module.exports;
let fails=0,warns=0; const F=(m)=>{fails++;console.log('FAIL',m)}, W=(m)=>{warns++;console.log('WARN',m)};
const ids=new Set();
CARS.forEach(c=>{
  const n=c.id;
  if(ids.has(n)) F('dup id '+n); ids.add(n);
  ['br','nm','bats','body','wr','note'].forEach(k=>{ if(typeof c[k]!=='string') F(n+' '+k+' not string'); });
  if(!(c.bat>5&&c.bat<200)) F(n+' bat '+c.bat);
  if(!(Array.isArray(c.p)&&c.p.length===2&&c.p[0]>0&&c.p[0]<=c.p[1])) F(n+' price '+c.p);
  if(!['','T','E'].includes(c.rk)) F(n+' rk');
  if(c.rk&&!(c.re>0)) F(n+' rk without re'); if(!c.rk&&c.re) F(n+' re without rk');
  if(c.re&&c.cl&&c.re>c.cl) F(n+' real > claimed');
  if(c.re&&c.cl){const r=c.re/c.cl; if(r<0.45) W(n+' real/claim '+r.toFixed(2)); if(c.rk==='T'&&r<0.55) W(n+' tested only '+Math.round(r*100)+'% of claim');}
  if(c.re){const e=c.re/c.bat; if(e<3||e>12) W(n+' km/kWh '+e.toFixed(1)); if(c.rk==='E'&&(e<3.8||e>8.5)) W(n+' estimated km/kWh '+e.toFixed(1));}
  if(!['h','m','l'].includes(c.conf)) F(n+' conf');
  if(!(c.dc>=0&&c.dc<=120)) F(n+' dc '+c.dc); if(!(c.ac>=2&&c.ac<=22)) F(n+' ac '+c.ac); if(!(c.seats>=2&&c.seats<=8)) F(n+' seats');
  if(c.m){ if(!(c.m.length===3&&c.m[0]>5&&c.m[2]>=30)) F(n+' m shape'); const d=Math.round(0.7*c.bat/(0.6*c.bat/(c.m[0]/60))*60/60*60/60*1)||0; const derived=(0.7*c.bat)/(0.6*c.bat/(c.m[0]/60))*60; if(Math.abs(derived-c.dc)>2) F(n+' dc '+c.dc+' vs derived from measured '+derived.toFixed(1)); if(!c.meas) F(n+' m without meas'); if(c.dce) F(n+' meas and dce'); }
  if(c.meas&&!c.m) F(n+' meas without m');
  if(c.src&&!/^https:\/\//.test(c.src)) F(n+' src'); if(c.src&&c.rk!=='T') W(n+' has src but not tested');
  if(c.rk==='E'&&/(tested|test )/i.test(c.note.replace(/not (a )?(standard )?test/i,''))) W(n+' estimated range but note says "tested": '+c.note.slice(0,90));
  if(c.rk==='T'&&!c.src&&c.conf==='h') W(n+' tested+high confidence without src link');
  if(c.baas){ const b=c.baas; if(!(b.price<b.own)) F(n+' baas price>=own'); if(b.own<c.p[0]-0.01||b.own>c.p[1]+0.01) W(n+' baas.own '+b.own+' outside price range '+c.p); if(!(b.perKm>0&&b.perKm<10)) F(n+' perKm'); if(b.type==='A'&&!b.minKm) F(n+' A without minKm'); if(b.type==='B'&&!b.basis) F(n+' B without basis'); if(!['A','B'].includes(b.type)) F(n+' baas type'); }
  if(c.ncap&&/5★/.test(c.ncap)&&!/NCAP/.test(c.ncap)) W(n+' 5★ without NCAP name');
});
{const acOnly=CARS.filter(c=>!c.dc).map(c=>c.id).sort().join(','); if(acOnly!=='comet,eva') F('AC-only cars changed (charging page text names comet and eva): '+acOnly);}
CARS.forEach(c=>{ if(!c.ur) return; const [r,n,rv]=c.ur;
  if(!(r>=1&&r<=5)) F(c.id+' ur rating '+r); if(!(Number.isInteger(n)&&n>=1)) F(c.id+' ur count'); if(!(Number.isInteger(rv)&&rv>=0)) F(c.id+' ur reviews');
  if(!/^https:\/\/www\.carwale\.com\//.test(c.uu||'')) F(c.id+' ur without CarWale url'); if(n>=10&&rv>n) W(c.id+' more reviews than ratings');
  if(Math.round(r*10)!==r*10) F(c.id+' ur rating not 1 decimal'); });
console.log('owner ratings on',CARS.filter(c=>c.ur).length,'cars');
PICKS.forEach(p=>{ [p.id,p.id2].filter(Boolean).concat(p.alt.map(a=>a[0])).forEach(i=>{ if(!L.carById(i)) F('pick id '+i); }); const c=L.carById(p.id); if(c&&(c.p[0]>0)){ /* band sanity */ } });
EDGES.forEach(e=>{ if(!NODES[e[0]]||!NODES[e[1]]) F('edge '+e); });
Object.entries(NODES).forEach(([k,n])=>{ if(!(n.la>6&&n.la<37&&n.lo>67&&n.lo<98)) F('node outside India '+k); });
STATES.forEach(s=>{ if(s.length!==3||!['good','warn','unk'].includes(s[2])) F('state '+s[0]); });
// graph connectivity
const seen=new Set(['delhi']),q=['delhi']; while(q.length){const u=q.pop(); EDGES.forEach(e=>{ [[e[0],e[1]],[e[1],e[0]]].forEach(([a,b])=>{ if(a===u&&!seen.has(b)){seen.add(b);q.push(b);} }); });}
Object.keys(NODES).forEach(k=>{ if(!seen.has(k)) F('node not connected '+k); });
// cross-check against the research report (10 Nov 2026) and the measured-test sources. [id, field, expected, tolerance]
const REPORT=[
 ['tiago','re',187,0],['comet','re',193,0],['tigor','re',190,0],['ec3','re',228,0],['nexon','re',350,0],['windsor','re',308,0],['creta','re',432,0],['clavis','re',364,0],['zs','re',339,0],['curvv','re',365,0],['harrier','re',401,0],['xev9e','re',456,0],['xev9s','re',478,1],['be6','re',449,0],['modely','re',370,0],['ioniq5','re',501,0],
 ['tiago','p0',6.99,0.01],['comet','p0',7.80,0.01],['punch','p0',9.79,0.01],['nexon','p0',12.49,0.01],['windsor','p0',14.85,0.01],['creta','p0',18.03,0.01],['zs','p0',17.99,0.01],['curvv','p0',17.19,0.01],['evitara','p0',16.19,0.01],['xev9e','p0',21.90,0.01],['harrier','p0',21.79,0.3],['sierra','p0',18.79,0.01],['modely','p0',50.89,0.01],['glc','p0',78.5,0.01],['ioniq5','p0',46.05,0.01],['ec3','p0',11.99,0.2],
 ['creta','cl',473,0],['windsor','cl',332,0],['comet','cl',230,0],['punch','cl',468,0],['nexon','cl',489,0],['zs','cl',461,0],['curvv','cl',502,0],['xev9e','cl',656,0],['tigor','cl',315,0],['glc','cl',711,0],
 ['tiago','bat',24,0],['punch','bat',40,0],['nexon','bat',45,0],['creta','bat',51.4,0],['curvv','bat',55,0],['xev9e','bat',79,0],['glc','bat',94,0],['modely','bat',60,0],
 ['windsor','baas.price',9.99,0],['nexon','baas.price',8.99,0],['nexon','baas.perKm',4.4,0],['harrier','baas.perKm',5.9,0],['creta','baas.price',10.99,0],['creta','baas.perKm',3.9,0],['windsor','baas.perKm',4.3,0],['xev9e','baas.price',13.9,0],['curvv','baas.perKm',5.0,0],['zs','baas.perKm',4.5,0],['ec3','baas.price',6.89,0],['ec3','baas.perKm',2.26,0],['comet','baas.perKm',3.2,0],['comet','baas.price',4.99,0],['tiago','baas.price',4.69,0],['punch','baas.price',6.59,0],['evitara','baas.price',10.99,0],['sierra','baas.perKm',5.5,0],['hector','baas.price',13.99,0],['ebella','baas.price',15.25,0],['xev9s','baas.price',12.65,0],['be6','baas.price',11.45,0],['syros','baas.price',7.99,0],
];
REPORT.forEach(([id,f,exp,tol])=>{ const c=L.carById(id); if(!c){F('report check: missing '+id);return;} let v; if(f==='p0') v=c.p[0]; else if(f.startsWith('baas.')) v=c.baas&&c.baas[f.slice(5)]; else v=c[f]; if(v==null||Math.abs(v-exp)>tol) F(`report mismatch ${id}.${f}: app ${v} vs report ${exp}`); });
// Measured charging (Autocar India, 2026): [id, battery, 20-80 min, 80-100 min, kW]
const MEAS=[['punch',40,27,31,180],['ebella',61,35,36,90],['be6',79,33,35,150],['vf7',70,38,0,180],['cla',85,35,34,150],['modely',60,23,30,250],['ioniq5',84,16,33,360]];
MEAS.forEach(([id,b,a,t,kw])=>{ const c=L.carById(id); if(!c||!c.m||c.m[0]!==a||c.m[1]!==t||c.m[2]!==kw) F('measured data mismatch '+id); if(Math.abs(c.bat-b)>1.2) W('measured battery differs '+id+' '+c.bat+' vs '+b);
  const p=L.dcMinutes(c,20,80,kw), q=L.dcMinutes(c,80,100,kw); if(Math.abs(p-a)>1.5) F(`model 20-80 ${id}: ${p.toFixed(1)} vs ${a}`); if(t&&Math.abs(q-t)>2) F(`model 80-100 ${id}: ${q.toFixed(1)} vs ${t}`); });
// the 80-100 ratio claim used in the page text: "30 to 36 minutes on almost every car"
const tails=MEAS.map(m=>m[3]).filter(Boolean); if(Math.min(...tails)<30||Math.max(...tails)>36) F('page text says 80-100 took 30-36 min but data '+tails);
const fast=MEAS.map(m=>m[2]); if(Math.min(...fast)!==16||Math.max(...fast)!==38) F('page text says 16-38 min for 20-80');
console.log(`cars ${CARS.length}, measured ${MEAS.length}, report checks ${REPORT.length}`);
/* crash-test table must agree with the per-car safety text */
{ const map={'Mahindra XEV 9e':'xev9e','Tata Harrier EV':'harrier','Mahindra BE 6':'be6','Tata Punch EV (2026)':'punch','Maruti Suzuki e Vitara':'evitara','Tata Curvv EV':'curvv','Tata Nexon EV':'nexon'};
  SAFETY.forEach(r=>{ const id=map[r[0]]; if(!id) return; const c=CARS.find(x=>x.id===id); if(!c) return F('SAFETY row has no car: '+r[0]); (r[1].match(/[\d.]+\/\d+/g)||[]).forEach(x=>{ if(c.ncap.indexOf(x)<0) F('SAFETY '+r[0]+' score '+x+' missing from car.ncap "'+c.ncap+'"'); }); if(!/5★/.test(c.ncap)) F('SAFETY says 5★ but car.ncap does not: '+id); });
  CARS.filter(c=>/5★ Bharat/.test(c.ncap)).forEach(c=>{ if(!Object.values(map).includes(c.id)) F('car has 5★ Bharat NCAP but no SAFETY row: '+c.id); });
  UPCOMING.forEach(u=>{ if(u.length!==3||u.some(x=>!x)) F('UPCOMING row malformed '+JSON.stringify(u)); }); }
CARS.filter(c=>c.rs).forEach(c=>{ const lo=Math.min(...c.rs),hi=Math.max(...c.rs),mid=(c.rs[0]+c.rs[1])/2; if(!(c.rs.length===2&&lo<=c.re&&c.re<=hi)) F('rs split must bracket the tested figure: '+c.id); if(Math.abs(mid-c.re)>2) F('tested figure should be the average of city and highway (±2 km): '+c.id+' '+mid+' vs '+c.re); if(c.rk!=='T') F('rs only allowed on tested cars: '+c.id); });
console.log('city/highway split on '+CARS.filter(c=>c.rs).length+' cars');
console.log(`DATA QA: ${fails} fail, ${warns} warn`); process.exit(fails?1:0);
