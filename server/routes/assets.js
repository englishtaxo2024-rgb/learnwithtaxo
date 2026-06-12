import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const storage = multer.diskStorage({
  destination: 'server/uploads',
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
const assets = [];
router.use(requireAuth, requireRole('admin'));

router.get('/', (_req, res) => res.json({ assets }));
router.post('/upload', upload.single('file'), (req, res) => {
  const asset = { id: String(Date.now()), fileName: req.file.filename, url: `/uploads/${req.file.filename}`, type: req.body.type || 'other', approved: false, uploadedAt: new Date().toISOString(), ext: path.extname(req.file.originalname) };
  assets.push(asset);
  res.json(asset);
});
router.patch('/:id', (req, res) => {
  const asset = assets.find((item) => item.id === req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  Object.assign(asset, req.body);
  res.json(asset);
});
router.delete('/:id', (req, res) => {
  const index = assets.findIndex((item) => item.id === req.params.id);
  if (index >= 0) assets.splice(index, 1);
  res.json({ ok: true });
});

export default router;
