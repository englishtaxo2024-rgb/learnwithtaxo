import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import googleSheetsRoutes from './routes/googleSheets.js';
import appsScriptRoutes from './routes/appsScript.js';
import syncRoutes from './routes/sync.js';
import assetsRoutes from './routes/assets.js';
import emailRoutes from './routes/email.js';
import aiRoutes from './routes/ai.js';
import { getDataSourceStatus } from './services/googleSheetsServer.js';
import authRoutes from './routes/auth.js';
import recordsRoutes from './routes/records.js';
import placementRoutes from './routes/placement.js';

const app = express();
const port = process.env.PORT || 8787;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const distIndexPath = path.join(distDir, 'index.html');

app.use(cors({ origin: process.env.SITE_URL || true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'learn-with-taxo-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/google-sheets', googleSheetsRoutes);
app.get('/api/data-sources/status', async (_req, res) => res.json(await getDataSourceStatus()));
app.use('/api/apps-script', appsScriptRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/ai', aiRoutes);

app.use(express.static(distDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
  if (fs.existsSync(distIndexPath)) return res.sendFile(distIndexPath);
  return res.status(503).send(`
    <!doctype html>
    <html lang="en">
      <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Learn with Taxo Setup</title></head>
      <body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#061B30;color:white;font-family:Arial,sans-serif;padding:24px">
        <main style="max-width:760px;border:1px solid rgba(195,225,245,.2);border-radius:10px;background:rgba(255,255,255,.08);padding:28px">
          <h1 style="color:#D4AF37">Build required</h1>
          <p>The Node server is running, but the React production build was not found.</p>
          <p>Run <code>npm install</code> then <code>npm run build</code>, and start with <code>npm start</code>.</p>
          <p>Hostinger settings: Node.js Web App, Node 20 LTS, entry file <code>server/index.js</code>, output directory <code>dist</code>.</p>
        </main>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Learn with Taxo API listening on ${port}`);
});
