import { Router } from 'express';
import { getDataSourceStatus } from '../services/googleSheetsServer.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.get('/status', requireAuth, requireRole('admin'), async (_req, res) => res.json(await getDataSourceStatus()));
export default router;
