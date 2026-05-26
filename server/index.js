import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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

const app = express();
const port = process.env.PORT || 8787;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

app.use(cors({ origin: process.env.SITE_URL || true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'learn-with-taxo-api' }));
app.use('/api/auth', authRoutes);
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
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Learn with Taxo API listening on ${port}`);
});
