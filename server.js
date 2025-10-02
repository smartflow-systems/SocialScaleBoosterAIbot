import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.get(['/health','/healthz'], (_req,res)=>{
  res.set('Cache-Control','no-store');
  res.status(200).json({ ok: true });
});

app.post('/gh-sync',(req,res)=>{
  const auth = req.get('authorization')||'';
  const expect = `Bearer ${process.env.REPLIT_TOKEN||''}`;
  if (auth !== expect) return res.status(401).send('nope');
  console.log('[SFS] Deploy', req.body); res.json({ status:'ok' });
});

app.get('/', (_req,res)=> res.redirect('/landing'));

app.listen(PORT,'0.0.0.0',()=> console.log(`SmartFlow server running on port ${PORT}`));
