#!/usr/bin/env bash
set -euo pipefail

# enter project (find package.json)
for d in "$PWD" "$HOME/workspace" "$HOME"; do
  [ -f "$d/package.json" ] && { cd "$d"; break; }
done

# kill any stuck node
pkill -f "node server" 2>/dev/null || true

# deps
npm i express cors >/dev/null

# server (ESM)
cat > server.mjs <<'JS'
// SmartFlow ESM server — glass UI + health/routes
import express from 'express'; import cors from 'cors';
import path from 'path'; import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url), __dirname = path.dirname(__filename);
const app = express(); app.use(cors()); app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.get('/health',(_q,res)=>res.json({ok:true,service:'SocialScaleBooster'}));
function listAll(app){const out=[];(app._router?.stack||[]).forEach(l=>{
 if(l.route){out.push({path:l.route.path,methods:Object.keys(l.route.methods).map(m=>m.toUpperCase())});}
 else if(l.name==='router'&&l.handle?.stack){l.handle.stack.forEach(s=>{
  if(s.route){out.push({path:s.route.path,methods:Object.keys(s.route.methods).map(m=>m.toUpperCase())});}});}
});return out.sort((a,b)=>a.path.localeCompare(b.path));}
app.get('/__routes',(_q,res)=>res.json(listAll(app)));
const port=process.env.PORT||3000; app.listen(port,()=>console.log('SmartFlow up on',port));
JS

# theme + landing (idempotent)
mkdir -p public
[ -f public/smartflow-theme.css ] || cat > public/smartflow-theme.css <<'CSS'
:root{--sf-black:#0D0D0D;--sf-brown:#3B2F2F;--sf-gold:#FFD700;--sf-gold-2:#E6C200;--sf-beige:#F5F5DC;--sf-white:#FFFFFF;--sf-gold-grad:linear-gradient(90deg,#FFD700 0%,#E6C200 100%);}
CSS

[ -f public/app.css ] || cat > public/app.css <<'CSS'
@import "./smartflow-theme.css";*{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,Arial;background:
radial-gradient(1200px 600px at 10% 0%, rgba(230,194,0,.08), transparent 60%),
radial-gradient(1200px 600px at 90% 100%, rgba(255,215,0,.06), transparent 60%),
var(--sf-black);color:var(--sf-beige)}
.header{max-width:1080px;margin:40px auto 20px;padding:0 16px;display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:700;letter-spacing:.5px;background:var(--sf-gold-grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.badge{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid #333;background:rgba(255,255,255,.04);backdrop-filter:blur(6px)}
.badge.ok{border-color:rgba(255,215,0,.5);box-shadow:0 0 12px rgba(255,215,0,.15)}
.grid{max-width:1080px;margin:10px auto 60px;padding:0 16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
.card{position:relative;border-radius:20px;padding:18px;border:1px solid rgba(230,194,0,.22);background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,.35)}
.card h3{margin:6px 0 8px;color:var(--sf-white)} .card p{margin:0 0 12px;color:#d9d4c2}
.cta{display:inline-block;padding:10px 14px;border-radius:12px;background:var(--sf-gold-grad);color:#1a1600;font-weight:700;text-decoration:none}
.cta:hover{filter:brightness(1.05)} .sub{font-size:12px;color:#b9b3a1}
CSS

[ -f public/index.html ] || cat > public/index.html <<'HTML'
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Social Scale Booster — SmartFlow</title>
<link rel="stylesheet" href="/app.css"></head><body>
<header class="header">
  <div class="logo">SmartFlow — Social Scale Booster</div>
  <a class="badge ok" href="/health" target="_blank">Live API ✓</a>
</header>
<main class="grid">
  <section class="card"><span class="sub">Project</span><h3>AI Caption Bot</h3>
    <p>Generate captions & hashtags tuned to your niche.</p>
    <a class="cta" href="/api/boost" target="_blank">Try Boost</a></section>
  <section class="card"><span class="sub">Scheduler</span><h3>Auto-Post Queue</h3>
    <p>Plan a week in minutes. Smart timing, fewer duds.</p>
    <a class="cta" href="#" target="_blank">Book a Demo</a></section>
  <section class="card"><span class="sub">Billing</span><h3>Starter → Premium</h3>
    <p>Stripe-ready. Upgrade without friction.</p>
    <a class="cta" href="#" target="_blank">See Pricing</a></section>
</main></body></html>
HTML

# package.json -> ESM + start
node - <<'NODE'
const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json','utf8'));
p.type='module'; p.scripts=p.scripts||{}; p.scripts.start='node server.mjs'; p.engines={node:">=18"};
fs.writeFileSync('package.json', JSON.stringify(p,null,2));
console.log('package.json updated: type=module, start=node server.mjs');
NODE

# Replit runner
printf '%s\n' 'run = "npm start"' > .replit

echo "== Launching =="
npm start
