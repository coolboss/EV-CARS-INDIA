/* ===== Car dataset: merged from the research report + two reader-supplied guides (10 Nov 2026) =====
   p = ex-showroom ₹ lakh [min,max]    bat = kWh used for cost maths (usable where known)
   cl = claimed km (ARAI/MIDC; WLTP for imports)   re = real-world km, rk: T = independently tested, E = estimate
   dc = minutes for roughly 10-80% on a DC fast charger, dce:1 means the number is a class estimate
   m = [min for 20-80%, min for 80-100% (0 = not reported), test charger kW] measured by Autocar India; meas:1 means dc was derived from it
   src = link to the independent test article for the tested range
   rs = [city km, highway km] from the same Autocar test; the tested figure is the blend of the two. rsd:1 = worked out from the reported km per kWh x battery size
   ur = [average stars out of 5, number of star ratings, number of written reviews] from CarWale user ratings, read on 11 Nov 2026; uu = that CarWale page
   ac = onboard AC charger kW (estimate unless noted)   conf: h = well cross-checked, m = some conflict, l = thin data */
var CARS = [
/* ---------- up to 30 kWh : small city cars ---------- */
{id:'eva',br:'Vayve',nm:'Eva',bat:18,bats:'9 / 12.6 / 18',p:[3.99,5.99],cl:250,re:null,rk:'',body:'Microcar',seats:3,dc:0,ac:3.3,wr:'Not stated',ncap:'',conf:'l',
 note:'Small solar-assisted three-seat city car. The maker shows pre-bookings closed, so confirm you can actually buy one. AC charging only.'},
{id:'comet',ur:[4.4,186,68],uu:'https://www.carwale.com/mg-cars/comet-ev/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'MG',nm:'Comet EV',bat:17.3,bats:'17.3',p:[7.80,10.17],cl:230,re:193,rk:'T',body:'Microcar',seats:4,dc:0,ac:3.3,wr:'Sources differ: 8 yr / 1.2 lakh km, or lifetime for first owner',ncap:'',conf:'m',
 baas:{type:'A',own:7.80,price:4.99,perKm:3.2,minKm:1500,variant:'Comet EV'},
 note:'Two-door and very easy to park. Most efficient EV tested (about 11 km/kWh). No fast charging, so it is a city car only.'},
{id:'tiago',ur:[4.5,106,19],uu:'https://www.carwale.com/tata-cars/tiago-ev/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'Tata',nm:'Tiago EV',bat:24,bats:'19.2 / 24',p:[6.99,10.09],cl:275,re:187,rk:'T',body:'Hatchback',seats:5,dc:35,dce:1,ac:3.3,wr:'15 yr / unlimited km for first owner (24 kWh)',ncap:'',conf:'m',
 baas:{type:'B',own:6.99,price:4.69,perKm:2.6,basis:1320,variant:'19.2 kWh'},
 note:'Cheapest proper 4-door EV from a big brand. The test was on the older 275 km version. No Bharat NCAP score found for the new generation.'},
{id:'tigor',ur:[3.8,32,16],uu:'https://www.carwale.com/tata-cars/tigor-ev/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'Tata',nm:'Tigor EV',bat:26,bats:'26',p:[12.49,13.75],cl:315,re:190,rk:'T',body:'Sedan',seats:5,dc:59,ac:3.3,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'m',
 note:'Tata has dropped the Tigor name for the petrol car, so any EV you see is probably leftover stock. Ask about the new Tiago EV first.'},
{id:'ec3',ur:[3.3,4,1],uu:'https://www.carwale.com/citroen-cars/ec3-x/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'Citroën',nm:'eC3 / eC3X',bat:29.2,bats:'29.2',p:[11.99,13.36],cl:246,re:228,rk:'T',body:'Hatchback',seats:5,dc:57,ac:3.3,wr:'Not stated',ncap:'',conf:'m',
 baas:{type:'A',own:11.99,price:6.89,perKm:2.26,minKm:2000,variant:'eC3X Live'},
 note:'Tested 228 km on the eC3. Some sites list a 330 km claim on a newer test cycle. Autocar lists 57 minutes for 10-80% on the 2026 eC3X, a slow fast-charger.'},
/* ---------- 30 to 45 kWh : compact ---------- */
{id:'punch',ur:[4.4,123,30],uu:'https://www.carwale.com/tata-cars/punch-ev/',src:'https://www.autocarindia.com/auto-features/2026-tata-punch-ev-real-world-range-tested-explained-440983',br:'Tata',nm:'Punch EV',bat:40,bats:'30 / 40',p:[9.79,12.99],cl:468,re:304,rs:[317,291],rk:'T',body:'Compact SUV',seats:5,dc:32,meas:1,m:[27,31,180],ac:7.2,wr:'15 yr / unlimited km for first owner (40 kWh)',ncap:'5★ Bharat NCAP (adult 31.09/32, child 45/49)',conf:'m',pick:'compact',
 baas:{type:'B',own:9.79,price:6.59,perKm:2.6,basis:1800,variant:'30 kWh'},
 note:'The 468 km claim is on the old cycle; some sites list 355 km. Charging time of 26 minutes is as listed by one site and other sources differ, so treat it as approximate.'},
{id:'nexon',ur:[4.4,251,84],uu:'https://www.carwale.com/tata-cars/nexon-ev/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'Tata',nm:'Nexon EV',bat:45,bats:'30 / 45',p:[12.49,17.89],cl:489,re:350,rk:'T',body:'Compact SUV',seats:5,dc:60,ac:7.2,wr:'15 yr / unlimited km for first owner (45 kWh)',ncap:'5★ Bharat NCAP (adult 29.86/32, child 44.95/49)',conf:'h',
 baas:{type:'B',own:14.34,price:8.99,perKm:4.4,basis:1800,variant:'45 kWh'},
 note:'Bigger cabin and better highway range than the Punch. A safe all-rounder.'},
{id:'xuv3xo',ur:[4.8,21,4],uu:'https://www.carwale.com/mahindra-cars/xuv-3xo-ev/',br:'Mahindra',nm:'XUV 3XO EV',bat:39.4,bats:'39.4',p:[13.89,14.96],cl:351,re:270,rk:'E',body:'Compact SUV',seats:5,dc:45,dce:1,ac:7.2,wr:'Not stated',ncap:'',conf:'l',
 note:'Quick for its size, but the range figure here is a planning estimate, not a test. Smaller battery makes it weaker for long trips.'},
{id:'xuv400',ur:[4.0,96,44],uu:'https://www.carwale.com/mahindra-cars/xuv400/',br:'Mahindra',nm:'XUV400 EV',bat:39.4,bats:'34.5 / 39.4',p:[15.49,17.69],cl:456,re:282,rk:'T',body:'Compact SUV',seats:5,dc:50,dce:1,ac:7.2,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'m',
 note:'282 km measured by CarWale. AC charging takes about 6.5 hours.'},
{id:'windsor',ur:[4.4,200,85],uu:'https://www.carwale.com/mg-cars/windsor-ev/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'MG',nm:'Windsor EV',bat:38,bats:'38',p:[14.85,17.14],cl:332,re:308,rs:[327,289],rsd:1,rk:'T',body:'Crossover',seats:5,dc:45,ac:7.4,wr:'Lifetime for first owner',ncap:'No Bharat NCAP score found',conf:'m',
 baas:{type:'A',own:14.85,price:9.99,perKm:4.3,minKm:1500,variant:'38 kWh'},
 note:'Tested range is very close to the claim. Roomy rear seat. MG now lists BaaS at ₹4.3/km (one magazine listed ₹3.99/km in Sept 2026).'},
/* ---------- 45 to 60 kWh : mainstream family ---------- */
{id:'syros',ur:[3.8,12,8],uu:'https://www.carwale.com/kia-cars/syros-ev/',br:'Kia',nm:'Syros EV',bat:51.4,bats:'42 / 51.4',p:[13.50,20.00],cl:526,re:380,rk:'E',body:'SUV',seats:5,dc:45,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'l',
 baas:{type:'B',own:13.50,price:7.99,perKm:3.3,basis:1800,variant:'42 kWh'},
 note:'Good build and packing (Team-BHP). Rear seat suits two adults better than three. No independent range test yet, so the range here is an estimate.'},
{id:'creta',ur:[4.7,52,20],uu:'https://www.carwale.com/hyundai-cars/creta-electric/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'Hyundai',nm:'Creta Electric',bat:51.4,bats:'42 / 51.4',p:[18.03,25.22],cl:473,re:432,rk:'T',body:'SUV',seats:5,dc:58,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'No Bharat NCAP score found',conf:'m',pick:'family',
 baas:{type:'B',own:18.03,price:10.99,perKm:3.9,basis:1800,variant:'42 kWh, 96-month loan'},
 note:'Best real-world range under ₹25 lakh in Autocar India’s test (432 km) and very efficient. Large service network. Hyundai added an assured buyback in Aug 2026. Listings show tops from ₹24.40 to ₹25.22 lakh.'},
{id:'clavis',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'Kia',nm:'Carens Clavis EV',bat:51.4,bats:'42 / 51.4',p:[17.99,24.99],cl:490,re:364,rk:'T',body:'MPV',seats:6,dc:45,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'h',
 note:'Same battery as the Creta but 364 km tested, against the Creta’s 432 km. Pick it for space, not range.'},
{id:'windsorpro',br:'MG',nm:'Windsor EV Pro',bat:52.9,bats:'52.9',p:[18.05,19.15],cl:449,re:390,rk:'E',body:'Crossover',seats:5,dc:45,dce:1,ac:7.4,wr:'Lifetime for first owner',ncap:'No Bharat NCAP score found',conf:'m',
 note:'Roomiest car under ₹20 lakh. A 20,000 km owner report on Team-BHP praises reliability and space but criticises suspension, AC and road noise.'},
{id:'zs',ur:[4.2,72,32],uu:'https://www.carwale.com/mg-cars/zs-ev/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'MG',nm:'ZS EV',bat:50.3,bats:'50.3',p:[17.99,20.75],cl:461,re:339,rk:'T',body:'SUV',seats:5,dc:50,dce:1,ac:7.4,wr:'8 yr / 1.5 lakh km',ncap:'',conf:'h',
 baas:{type:'A',own:17.99,price:13.00,perKm:4.5,minKm:1500,variant:'ZS EV'},
 note:'AC charging takes about 9 hours. A fine car, though newer rivals test further.'},
{id:'curvv',ur:[4.5,102,34],uu:'https://www.carwale.com/tata-cars/curvv-ev/',src:'https://www.autocarindia.com/auto-features/every-mass-market-ev-real-world-range-tested-434105',br:'Tata',nm:'Curvv EV',bat:55,bats:'45 / 55',p:[17.19,19.69],cl:502,re:365,rk:'T',body:'SUV coupe',seats:5,dc:40,ac:7.2,wr:'15 yr / unlimited km for first owner',ncap:'5★ Bharat NCAP (adult 30.81/32, child 44.83/49)',conf:'h',
 baas:{type:'B',own:17.19,price:10.99,perKm:5.0,basis:1800,variant:'55 kWh'},
 note:'Older stock may carry large discounts that end on 15 Nov 2026 (up to ₹3.35 lakh).'},
{id:'vf6',ur:[4.5,53,21],uu:'https://www.carwale.com/vinfast-cars/vf-6/',br:'VinFast',nm:'VF6',bat:59.6,bats:'59.6',p:[18.19,20.09],cl:465,re:370,rk:'E',body:'SUV',seats:5,dc:25,ac:11,wr:'Not stated',ncap:'No Bharat NCAP score found',conf:'l',
 note:'Quick DC charging claimed. The brand is new in India, so check service reach near you.'},
/* ---------- 60 to 80 kWh : long range ---------- */
{id:'evitara',ur:[4.2,75,28],uu:'https://www.carwale.com/maruti-suzuki-cars/e-vitara/',br:'Maruti Suzuki',nm:'e Vitara',bat:61,bats:'49 / 61',p:[16.19,20.21],cl:543,re:370,rk:'E',body:'SUV',seats:5,dc:45,ac:11,wr:'8 yr / 1.6 lakh km (secondary source)',ncap:'5★ Bharat NCAP (adult 31.49/32, child 43/49)',conf:'m',
 baas:{type:'B',own:16.19,price:10.99,perKm:3.99,basis:1800,variant:'49 kWh (61 kWh is ₹4.39/km)'},
 note:'A reader-supplied guide quotes 338 km in the city and 403 km on the highway. That is not an independent test, so 370 km is shown as an estimate. Widest service reach of any brand. Assured buyback up to 60% after 3 years / 45,000 km.'},
{id:'ebella',ur:[3.3,12,3],uu:'https://www.carwale.com/toyota-cars/urban-cruiser-ebella/',br:'Toyota',nm:'Urban Cruiser Ebella',bat:61,bats:'49 / 61',p:[23.60,23.60],cl:543,re:402,rk:'E',body:'SUV',seats:5,dc:41,meas:1,m:[35,36,90],ac:11,wr:'Not stated',ncap:'',conf:'m',
 baas:{type:'B',own:23.60,price:15.25,perKm:4.99,basis:1800,variant:'E3'},
 note:'Twin of the e Vitara with Toyota’s dealer network. Price shown is the E3 variant.'},
{id:'vfmpv7',ur:[3.6,16,1],uu:'https://www.carwale.com/vinfast-cars/vf-mpv-7/',br:'VinFast',nm:'VF MPV 7',bat:60.13,bats:'60.13',p:[20.39,22.99],cl:517,re:395,rk:'E',body:'MPV',seats:7,dc:30,ac:11,wr:'Not stated',ncap:'',conf:'l',
 note:'Seven seats. VinFast cut its price by ₹4.10 lakh in Nov 2026, so check the latest price.'},
{id:'atto3',ur:[4.0,77,39],uu:'https://www.carwale.com/byd-cars/atto-3/',br:'BYD',nm:'Atto 3',bat:60.48,bats:'49.92 / 60.48',p:[24.99,34.49],cl:521,re:400,rk:'E',body:'SUV',seats:5,dc:45,dce:1,ac:7,wr:'8 yr (BYD standard)',ncap:'5★ Euro NCAP (not Bharat NCAP)',conf:'m',
 note:'Team-BHP owners report slow spare parts and weak cabin cooling in some cases. Check local BYD service before you buy.'},
{id:'sierra',ur:[4.2,14,7],uu:'https://www.carwale.com/tata-cars/sierra-ev/',src:'https://www.autocarindia.com/auto-features/tata-sierra-ev-awd-vs-harrier-ev-awd-real-world-range-compared-441233',br:'Tata',nm:'Sierra EV',bat:75,bats:'63 / 75',p:[18.79,25.99],cl:624,re:438,rs:[438,437],rk:'T',body:'SUV',seats:5,dc:40,dce:1,ac:7.2,wr:'15 yr / unlimited km; next owner gets 10 yr / 2 lakh km',ncap:'',conf:'m',pick:'longalt',
 baas:{type:'B',own:18.79,price:11.99,perKm:5.5,basis:1800,variant:'63 kWh'},
 note:'438 km was tested on the AWD version. Strong challenger to the Mahindras. Compare ride and refinement before you book.'},
{id:'harrier',ur:[4.6,171,56],uu:'https://www.carwale.com/tata-cars/harrier-ev/',src:'https://www.autocarindia.com/auto-features/tata-sierra-ev-awd-vs-harrier-ev-awd-real-world-range-compared-441233',br:'Tata',nm:'Harrier EV',bat:75,bats:'65 / 75',p:[21.79,29.29],cl:622,re:401,rs:[408,393],rk:'T',body:'SUV',seats:5,dc:25,ac:7.2,wr:'15 yr / unlimited km for first owner',ncap:'5★ Bharat NCAP (adult 32/32, child 45/49)',conf:'m',
 baas:{type:'B',own:21.79,price:14.49,perKm:5.9,basis:1800,variant:'65 kWh'},
 note:'AWD and 120 kW charging. The AWD version tested 401 km and used the most energy of the EVs tested (5.35 km/kWh).'},
{id:'be6',ur:[4.7,381,113],uu:'https://www.carwale.com/mahindra-cars/be-6/',br:'Mahindra',nm:'BE 6 Sporteq',bat:79,bats:'59 / 70 / 79',p:[19.45,27.70],cl:683,re:449,rk:'T',body:'SUV coupe',seats:5,dc:38,meas:1,m:[33,35,150],ac:11.2,wr:'Lifetime for first private owner',ncap:'5★ Bharat NCAP (adult 31.97/32, child 45/49)',conf:'m',
 baas:{type:'B',own:19.45,price:11.45,perKm:3.75,basis:1800,variant:'59 kWh'},
 note:'449 km comes from a test of the regular BE 6 79 kWh, not the Sporteq. Charges at up to 180 kW.'},
{id:'xev9e',ur:[4.7,213,69],uu:'https://www.carwale.com/mahindra-cars/xev-9e/reviews/',src:'https://www.autocarindia.com/auto-features/mahindra-xev-9e-real-world-range-tested-explained-436045',br:'Mahindra',nm:'XEV 9e',bat:79,bats:'59 / 79',p:[21.90,31.25],cl:656,re:456,rs:[425,488],rk:'T',body:'SUV coupe',seats:5,dc:20,ac:11.2,wr:'Lifetime for first private owner',ncap:'5★ Bharat NCAP (adult 32/32, child 45/49)',conf:'h',pick:'long5',
 baas:{type:'B',own:21.90,price:13.90,perKm:3.75,basis:1800,variant:'59 kWh'},
 note:'Great ride, big boot, 180 kW charging. Autocar’s 456 km is a blend: 425 km on its city loop and 488 km on its highway loop, worked out from the charge used in about 40°C heat, not by driving to empty. Mahindra says 500 km or more in real use. Mild weather and gentle driving can beat 456 km, and hard driving or heat can fall short. The 20-minute fast-charge time is the maker’s figure: the similar BE 6 took 33 minutes for 20-80% on a 150 kW charger in Autocar’s test. The touchscreen software is complex but Autocar says updates fixed earlier bugs. Owners report waits of about 4 months for top variants.'},
{id:'xev9s',ur:[4.6,108,28],uu:'https://www.carwale.com/mahindra-cars/xev-9s/',src:'https://www.autocarindia.com/auto-features/mahindra-xev-9s-real-world-range-tested-explained-440015',br:'Mahindra',nm:'XEV 9S',bat:79,bats:'59 / 70 / 79',p:[20.65,30.90],cl:679,re:478,rs:[478,477],rk:'T',body:'SUV',seats:7,dc:20,ac:11.2,wr:'Lifetime for first private owner',ncap:'',conf:'m',pick:'long7',
 baas:{type:'B',own:20.65,price:12.65,perKm:3.75,basis:1800,variant:'59 kWh'},
 note:'Went the furthest of any mass-market EV in Autocar’s tests (477.5 km). No separate crash-test result found for the 9S. The 20-minute fast-charge time is the maker’s figure (the similar BE 6 took 33 minutes for 20-80% on a 150 kW charger). Three rows or six captain seats. Starting price is listed from ₹19.95 to ₹21.40 lakh by different sources.'},
{id:'hector',ur:[4.6,22,20],uu:'https://www.carwale.com/mg-cars/hector-tomahawk-ev/',src:'https://www.autocarindia.com/auto-features/mg-hector-tomahawk-ev-real-world-range-tested-explained-441165',br:'MG',nm:'Hector Tomahawk EV',bat:69.2,bats:'69.2',p:[20.25,24.25],cl:517,re:446,rs:[495,397],rk:'T',body:'SUV',seats:7,dc:45,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'m',
 baas:{type:'B',own:19.50,price:13.99,perKm:4.9,basis:1800,variant:'base (pre-hike price)'},
 note:'Tested 446 km, very good for the price. MG raised the price by ₹75,000 on 6 Nov 2026.'},
{id:'vf7',ur:[4.0,40,25],uu:'https://www.carwale.com/vinfast-cars/vf-7/',br:'VinFast',nm:'VF7',bat:70.8,bats:'59.6 / 70.8',p:[22.99,28.09],cl:510,re:391,rk:'T',body:'SUV',seats:5,dc:44,meas:1,m:[38,0,180],ac:11,wr:'Not stated',ncap:'No Bharat NCAP score found',conf:'m',
 note:'391 km tested on the AWD version.'},
{id:'emax7',ur:[4.0,19,10],uu:'https://www.carwale.com/byd-cars/emax-7/',br:'BYD',nm:'eMax 7',bat:71.8,bats:'55.4 / 71.8',p:[26.90,29.90],cl:530,re:370,rk:'E',body:'MPV',seats:7,dc:45,dce:1,ac:7,wr:'8 yr (BYD standard)',ncap:'',conf:'l',
 note:'Seven-seat MPV. Range here is an estimate.'},
/* ---------- premium 60 to 80 kWh ---------- */
{id:'ex30',ur:[4.8,15,5],uu:'https://www.carwale.com/volvo-cars/ex30/',br:'Volvo',nm:'EX30',bat:69,bats:'69',p:[41.00,41.00],cl:480,re:403,rk:'T',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'m',note:'403 km from a CarWale road test.'},
{id:'ix1',ur:[4.7,19,10],uu:'https://www.carwale.com/bmw-cars/ix1-lwb/',br:'BMW',nm:'iX1 LWB',bat:66.4,bats:'66.4',p:[52.70,54.70],cl:531,re:398,rk:'T',body:'SUV',seats:5,dc:30,ac:11,wr:'Not stated',ncap:'',conf:'m',note:'Wide dealer network. Price listed at ₹52.70 or ₹54.70 lakh by different sources.'},
{id:'countryman',ur:[3.5,2,0],uu:'https://www.carwale.com/mini-cars/countryman-electric/',br:'MINI',nm:'Countryman Electric',bat:66.45,bats:'66.45',p:[54.90,66.90],cl:450,re:375,rk:'E',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'ex40',br:'Volvo',nm:'EX40',bat:69,bats:'69',p:[49.00,50.10],cl:592,re:null,rk:'',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range depends on the variant, and no reliable test was found.'},
{id:'ec40',ur:[5.0,19,7],uu:'https://www.carwale.com/volvo-cars/ec40/',br:'Volvo',nm:'EC40',bat:78,bats:'78',p:[59.00,59.00],cl:530,re:400,rk:'E',body:'SUV coupe',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'modely',ur:[4.4,42,16],uu:'https://www.carwale.com/tesla-cars/model-y/',src:'https://www.autocarindia.com/auto-features/tesla-model-y-rwd-real-world-range-tested-explained-440915',br:'Tesla',nm:'Model Y (RWD)',bat:60,bats:'60 usable (about 64 gross)',p:[50.89,59.89],cl:500,re:370,rs:[350,391],rk:'T',body:'SUV',seats:5,dc:27,meas:1,m:[23,30,250],ac:11,wr:'Not stated',ncap:'Top ratings from NHTSA and Euro NCAP',conf:'m',
 note:'Best fast-charging network of any brand (up to 250 kW) but Tesla’s chargers in India are for Tesla owners only, and service points are few. Tested 370 km, so it is not the efficiency leader.'},
{id:'lexus',br:'Lexus',nm:'ES 500e',bat:74.68,bats:'74.68',p:[89.99,91.20],cl:580,re:440,rk:'E',body:'Sedan',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'cyber',br:'MG',nm:'Cyberster',bat:77,bats:'77',p:[75,88],cl:580,re:450,rk:'E',body:'Roadster',seats:2,dc:40,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Two-seat sports roadster. Price range differs across sources.'},
/* ---------- premium 80 to 100 kWh ---------- */
{id:'seal',ur:[4.7,55,15],uu:'https://www.carwale.com/byd-cars/seal/reviews/',br:'BYD',nm:'Seal',bat:82.56,bats:'61.44 / 82.56',p:[41.50,53.65],cl:650,re:470,rk:'E',body:'Sedan',seats:5,dc:33,ac:11,wr:'8 yr (BYD standard)',ncap:'',conf:'m',pick:'premSedan',note:'Good value electric sedan. BYD’s service and parts network is smaller than the German brands’.'},
{id:'sealion7',ur:[4.5,28,12],uu:'https://www.carwale.com/byd-cars/sealion-7/',br:'BYD',nm:'Sealion 7',bat:82.56,bats:'71.8 / 82.56',p:[41.90,55.90],cl:542,re:375,rk:'T',body:'SUV',seats:5,dc:24,ac:11,wr:'8 yr (BYD standard)',ncap:'',conf:'m',note:'Fast charging, but only 375 km tested on the AWD.'},
{id:'ioniq5',ur:[4.0,3,1],uu:'https://www.carwale.com/hyundai-cars/ioniq-5/',src:'https://www.autocarindia.com/auto-features/2026-hyundai-ioniq-5-real-world-range-tested-explained-440980',br:'Hyundai',nm:'Ioniq 5',bat:84,bats:'84',p:[46.05,55.71],cl:690,re:501,rs:[523,479],rk:'T',body:'SUV',seats:5,dc:19,meas:1,m:[16,33,360],ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'m',pick:'premium',
 note:'800V platform. Autocar measured 20-80% in 16 minutes on a 360 kW charger. Sources differ on battery and price: older listings show ₹46.05 lakh, newer ones ₹55.71 lakh with an 84 kWh pack. Confirm at the dealer.'},
{id:'ev6',ur:[5.0,21,3],uu:'https://www.carwale.com/kia-cars/ev6/reviews/',br:'Kia',nm:'EV6',bat:84,bats:'84',p:[65.98,65.98],cl:663,re:498,rk:'T',body:'SUV',seats:5,dc:18,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'m',note:'Very fast charging and about the same real range as the Ioniq 5.'},
{id:'modelyl',br:'Tesla',nm:'Model Y L (6-seat)',bat:88.2,bats:'about 88.2 (estimate)',p:[61.99,61.99],cl:681,re:485,rk:'E',body:'SUV',seats:6,dc:25,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Tesla does not publish full battery sizes, so the 88.2 kWh figure is an estimate.'},
{id:'cla',br:'Mercedes-Benz',nm:'CLA Electric (250+)',bat:85.5,bats:'58 / 85.5',p:[56.50,65.00],cl:792,re:580,rk:'T',body:'Sedan',seats:5,dc:41,meas:1,m:[35,34,150],ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'m',note:'About 580 km from a CarWale mixed-driving test, among the best efficiency of any premium EV. Price listed at ₹56.50 or ₹65 lakh.'},
{id:'i5',br:'BMW',nm:'i5 LWB',bat:81.6,bats:'81.6',p:[79.60,79.60],cl:669,re:500,rk:'E',body:'Sedan',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'i4',ur:[4.6,14,5],uu:'https://www.carwale.com/bmw-cars/i4/reviews/',br:'BMW',nm:'i4',bat:83.9,bats:'70.2 / 83.9',p:[72.50,77.50],cl:590,re:null,rk:'',body:'Sedan',seats:5,dc:31,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'No reliable range test found.'},
{id:'i5m60',br:'BMW',nm:'i5 M60',bat:83.9,bats:'83.9',p:[120,120],cl:485,re:400,rk:'E',body:'Sedan',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Performance version. Range is an estimate.'},
{id:'m9',ur:[4.6,25,8],uu:'https://www.carwale.com/mg-cars/m9/reviews/',br:'MG',nm:'M9',bat:90,bats:'90',p:[75.02,85],cl:548,re:303,rk:'T',body:'MPV',seats:7,dc:40,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'m',caution:1,note:'Warning: Autocar’s database shows about 303 km tested against a 548 km claim. Think hard before buying it for highway trips.'},
{id:'glc',br:'Mercedes-Benz',nm:'GLC Electric',bat:94,bats:'94',p:[78.50,78.50],cl:711,re:530,rk:'E',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'m',pick:'luxury',
 note:'800V, dual-motor AWD. Launched 4 Nov 2026 and Mercedes says orders already cover supply until March 2027. No long-term owner reports exist yet.'},
{id:'eqe',br:'Mercedes-Benz',nm:'EQE SUV',bat:90.6,bats:'about 90.6',p:[141,141],cl:550,re:415,rk:'E',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'eqab',br:'Mercedes-Benz',nm:'EQA / EQB',bat:70,bats:'about 66-70',p:[67.20,82.50],cl:0,re:null,rk:'',body:'SUV',seats:7,dc:30,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'l',note:'EQB has up to seven seats. Little data found.'},
{id:'gran',br:'Maserati',nm:'GranTurismo / GranCabrio Folgore',bat:92.5,bats:'92.5',p:[314,330],cl:0,re:null,rk:'',body:'Coupe',seats:4,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Special-order import. Delivery needs confirming.'},
/* ---------- above 100 kWh : luxury ---------- */
{id:'ev9',ur:[4.5,9,1],uu:'https://www.carwale.com/kia-cars/ev9/',br:'Kia',nm:'EV9',bat:99.8,bats:'99.8',p:[130,130],cl:561,re:415,rk:'E',body:'SUV',seats:6,dc:25,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'l',note:'Large six-seat SUV. Range is an estimate.'},
{id:'macan',br:'Porsche',nm:'Macan Electric',bat:100,bats:'about 100',p:[122,178],cl:616,re:490,rk:'E',body:'SUV',seats:5,dc:25,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'The driver’s pick in this group. Range is an estimate.'},
{id:'ix',ur:[4.7,9,4],uu:'https://www.carwale.com/bmw-cars/ix/',br:'BMW',nm:'iX',bat:105.2,bats:'105.2 usable',p:[140,140],cl:635,re:504,rk:'T',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'m',note:'504 km tested.'},
{id:'ex90',br:'Volvo',nm:'EX90',bat:106,bats:'about 111 gross',p:[126,126],cl:625,re:485,rk:'E',body:'SUV',seats:7,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Seven seats. Range is an estimate.'},
{id:'eqs',ur:[4.7,18,7],uu:'https://www.carwale.com/mercedes-benz-cars/eqs/',br:'Mercedes-Benz',nm:'EQS sedan',bat:107.8,bats:'107.8',p:[130,162],cl:813,re:600,rk:'E',body:'Sedan',seats:5,dc:30,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'l',note:'Claim listed as 813 or 857 km by different sources.'},
{id:'eqssuv',ur:[4.8,6,1],uu:'https://www.carwale.com/mercedes-benz-cars/eqs-suv/',br:'Mercedes-Benz',nm:'EQS SUV',bat:122,bats:'122',p:[134,148],cl:820,re:573,rk:'E',body:'SUV',seats:7,dc:30,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'m',note:'573 km is from a V3Cars mixed-use calculation. Good for family luxury travel.'},
{id:'q8',ur:[5.0,2,0],uu:'https://www.carwale.com/audi-cars/q8-e-tron/',br:'Audi',nm:'Q8 e-tron',bat:114,bats:'95 / 114',p:[115,127],cl:582,re:465,rk:'E',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Older Audi stock: confirm what is still on sale.'},
{id:'q8sb',br:'Audi',nm:'Q8 Sportback e-tron',bat:114,bats:'95 / 114',p:[119,132],cl:600,re:470,rk:'E',body:'Coupe SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Check which battery variant and whether it is still on sale.'},
{id:'etrongt',br:'Audi',nm:'e-tron GT',bat:93,bats:'93',p:[172,195],cl:0,re:null,rk:'',body:'Sedan',seats:4,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Some listings may be old stock. Range not confirmed in my sources.'},
{id:'etron',ur:[4.7,6,2],uu:'https://www.carwale.com/audi-cars/e-tron/',br:'Audi',nm:'e-tron / e-tron Sportback (older)',bat:95,bats:'95',p:[102,126],cl:0,re:null,rk:'',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Probably old stock only. Ask the dealer what is actually available.'},
{id:'taycan',br:'Porsche',nm:'Taycan',bat:105,bats:'89 to 105',p:[170,274],cl:0,re:null,rk:'',body:'Sedan',seats:4,dc:20,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range depends on the variant.'},
{id:'cayenne',br:'Porsche',nm:'Cayenne Electric',bat:113,bats:'113',p:[177,228],cl:632,re:485,rk:'E',body:'SUV',seats:5,dc:25,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Very high performance. Range is an estimate.'},
{id:'i7',ur:[5.0,2,1],uu:'https://www.carwale.com/bmw-cars/i7/',br:'BMW',nm:'i7',bat:112.5,bats:'112.5',p:[195,265],cl:700,re:500,rk:'E',body:'Sedan',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'The chauffeur-driven pick. Range is an estimate.'},
{id:'grecale',br:'Maserati',nm:'Grecale Folgore',bat:105,bats:'105',p:[190,190],cl:501,re:385,rk:'E',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'emeya',br:'Lotus',nm:'Emeya',bat:102,bats:'about 102',p:[234,234],cl:610,re:435,rk:'E',body:'Sedan',seats:4,dc:20,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'eletre',br:'Lotus',nm:'Eletre',bat:112,bats:'about 112',p:[255,299],cl:545,re:400,rk:'E',body:'SUV',seats:5,dc:20,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'maybach',ur:[5.0,2,2],uu:'https://www.carwale.com/mercedes-benz-cars/maybach-eqs-suv/',br:'Mercedes-Maybach',nm:'EQS SUV',bat:122,bats:'122',p:[240,265],cl:611,re:485,rk:'E',body:'SUV',seats:4,dc:30,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'l',note:'Range is an estimate.'},
{id:'g580',br:'Mercedes-Benz',nm:'G 580 Electric',bat:116,bats:'116',p:[310,310],cl:473,re:336,rk:'E',body:'SUV',seats:5,dc:30,dce:1,ac:11,wr:'8 yr / 1.6 lakh km',ncap:'',conf:'l',note:'336 km comes from a mixed road and off-road drive, so it is not a standard test.'},
{id:'spectre',br:'Rolls-Royce',nm:'Spectre',bat:102,bats:'about 102',p:[750,950],cl:530,re:418,rk:'E',body:'Coupe',seats:4,dc:30,dce:1,ac:11,wr:'Not stated',ncap:'',conf:'l',note:'Price listed at ₹7.50 or ₹9.5 crore by different sources.'}
];

/* Best picks, merged from all three sources (corrections noted in the text) */
var PICKS = [
 {key:'city',band:'City car',rng:'Up to 30 kWh · under ₹13 L',id:'tiago',alt:[['comet','Pick this if you only drive in a tight city and have another car for highways']],
  why:'Cheapest proper 4-door EV from a big brand. It can fast-charge, which the Comet cannot, and Tata gives a 15-year battery warranty. Tested range is only 187 km, so it is a city car.'},
 {key:'compact',band:'Compact',rng:'30 to 45 kWh · ₹10-15 L',id:'punch',alt:[['nexon','More range and a bigger cabin for highway use']],
  why:'5-star Bharat NCAP, lifetime-style battery warranty, handy size and ground clearance. Good value in this class.'},
 {key:'family',band:'Family',rng:'45 to 60 kWh · ₹15-25 L',id:'creta',alt:[['evitara','5 stars and the widest service reach'],['windsorpro','Most rear-seat space under ₹20 L'],['syros','Strong build; test-drive it. No independent range test yet']],
  why:'Best tested range among 45-60 kWh cars (432 km) and the best efficiency in its class. Big service network and good resale. Caveat: battery cover is 8 years, where Tata and Mahindra give lifetime cover.'},
 {key:'long',band:'Long range',rng:'60 to 80 kWh · ₹20-32 L',id:'xev9e',id2:'xev9s',alt:[['sierra','Strong challenger, tested 438 km on AWD'],['hector','446 km tested at a lower price']],
  why:'XEV 9S went furthest of any mass-market EV tested (478 km). XEV 9e scored a perfect 32/32 for adult safety. Both charge at up to 180 kW and carry a lifetime battery warranty for the first owner. Pick the 9e for five seats, the 9S for six or seven.'},
 {key:'premium',band:'Premium',rng:'₹40-80 L',id:'ioniq5',alt:[['modely','Best charging network, but Tesla-only and few service points'],['seal','Best-value electric sedan'],['cla','Most efficient premium EV tested (about 580 km)']],
  why:'Changed from my first report, which picked the Tesla Model Y. The Ioniq 5 tested 501 km and charges 20-80% in 16 minutes on a very fast charger. The Model Y tested only 370 km.'},
 {key:'luxury',band:'Luxury',rng:'₹78 L and above',id:'glc',alt:[['macan','For people who love driving'],['eqssuv','Family luxury travel'],['i7','Chauffeur-driven']],
  why:'711 km claim from a 94 kWh pack at about half the price of an EQS. Very new (launched 4 Nov 2026), so there is no long-term owner data yet.'}
];

/* Upcoming launches (dates are tentative) */
var UPCOMING = [
 ['Denza D9 MPV and Z9 GT (BYD luxury brand)','13 Nov 2026','₹80 L to ₹1.5 Cr'],
 ['VinFast VF3','Late Nov 2026, no official date','₹7.5-12 L'],
 ['Mini Cooper SE','27 Nov 2026','₹55-65 L'],
 ['Honda 0 Alpha (India name not final)','Production model shown 2 Dec 2026. Sale date not announced','about ₹16-20 L'],
 ['Tata Safari EV','Was planned for the 2026 festive season. No date announced yet','₹22.5-30 L'],
 ['Mahindra Thar e','Sites disagree: 15 Nov 2026 or 2027. Not confirmed','₹22-30 L'],
 ['JSW Chery iCar V23 SUV','Sites disagree: 15 Nov 2026 or 2027. Not confirmed','under ₹20 L']
];

/* Road tax / incentives by state (as researched, Nov 2026) */
var STATES = [
 ['Delhi','Road tax and registration fully waived (EVs up to about ₹30 L). A new EV Policy 2.0 is still a draft.','good'],
 ['Maharashtra','100% motor vehicle tax exemption (policy valid 1 Apr 2025 - 31 Mar 2030) plus toll exemption on Mumbai-Pune Expressway, Samruddhi Mahamarg and Atal Setu. One site also reports a ₹1.5 lakh purchase incentive; others say no, so treat it as unconfirmed.','good'],
 ['Tamil Nadu','100% road tax waiver until 31 Dec 2027.','good'],
 ['Telangana','Road tax and registration fully waived.','good'],
 ['Karnataka','The old full waiver ended in April 2026. A lifetime tax now applies: 5% up to ₹10 L, 8% for ₹10-25 L, 10% above ₹25 L.','warn'],
 ['Uttar Pradesh','Waiver reportedly expired in October 2025. Standard tax applies.','warn'],
 ['Gujarat','Sources conflict (full waiver, 50% or a token 1%). Ask your RTO before you book.','unk'],
 ['Other states','Rules differ and change often. Ask the dealer for the on-road price in writing.','unk']
];

/* Safety results found (Bharat NCAP unless stated) */
var SAFETY = [
 ['Mahindra XEV 9e','Adult 32/32, child 45/49','5★'],
 ['Tata Harrier EV','Adult 32/32, child 45/49','5★'],
 ['Mahindra BE 6','Adult 31.97/32, child 45/49','5★'],
 ['Tata Punch EV (2026)','Adult 31.09/32, child 45/49','5★'],
 ['Maruti Suzuki e Vitara','Adult 31.49/32, child 43/49','5★'],
 ['Tata Curvv EV','Adult 30.81/32, child 44.83/49','5★'],
 ['Tata Nexon EV','Adult 29.86/32, child 44.95/49','5★'],
 ['BYD Atto 3','Euro NCAP (not Bharat NCAP)','5★ Euro'],
 ['Hyundai Creta Electric, Tiago EV, MG Windsor, VinFast cars and others','No Bharat NCAP result found','None found']
];
