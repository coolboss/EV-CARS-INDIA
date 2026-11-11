import os,re,sys
d=os.path.dirname(os.path.abspath(__file__)); r=lambda f:open(os.path.join(d,'src',f),encoding='utf-8').read()
FILES=['data-cars.js','data-map.js','data-india.js','logic.js','ui.js','v-learn.js','v-cars.js','v-charging.js','v-map.js','v-money.js','v-buy.js']
TITLE='EV Raasta | Electric cars in India, explained'
DESC='A plain-language guide for first-time EV buyers in India: battery basics, 70 cars with tested range, chargers and charging times, a live charger map, a highway trip planner, tax and battery-rental maths, and buying checklists.'
FAV="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230A6B4B'/%3E%3Cpath d='M36 8 18 36h12l-3 20 19-30H34z' fill='%23F2B705'/%3E%3C/svg%3E"
CSP="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'unsafe-inline'; img-src data:; frame-src https://maps.google.com https://www.google.com; base-uri 'none'; form-action 'none'"
def js(live):
    out=''.join(r(f)+'\n' for f in FILES)
    out=out.replace('__LIVE_EMBED__','true' if live else 'false')
    return out+r('main.js')
FONT='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">'
css=r('style.css')
os.makedirs(os.path.join(d,'dist'),exist_ok=True)
# standalone (GitHub Pages)
std='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="%s">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0A6B4B">
<meta name="description" content="%s">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:type" content="website">
<title>%s</title>
<link rel="icon" href="%s">
%s
<style>
%s
</style>
</head>
<body>
<div id="app"></div>
<noscript><p style="font:16px/1.5 system-ui,sans-serif;padding:24px;max-width:60ch">EV Raasta needs JavaScript to run. Please turn it on in your browser.</p></noscript>
<script>
(function(){
%s
})();
</script>
</body>
</html>
'''%(CSP,DESC,TITLE,DESC,TITLE,FAV,FONT,css,js(True))
open(os.path.join(d,'dist','index.html'),'w',encoding='utf-8').write(std)
# artifact fragment (embedded maps are blocked there)
art='''<title>EV Raasta</title>
<meta name="claude:viewport-fit-sides" content="cover">
%s
<style>
%s
</style>
<div id="app"></div>
<script>
(function(){
%s
})();
</script>
'''%(FONT,css,js(False))
open(os.path.join(d,'dist','artifact.html'),'w',encoding='utf-8').write(art)
print('standalone',len(std),'artifact',len(art))
