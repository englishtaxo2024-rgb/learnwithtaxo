import { Router } from 'express';
import { getDataSourceStatus } from '../services/googleSheetsServer.js';

const router = Router();
router.get('/status', async (_req, res) => res.json(await getDataSourceStatus()));
export default router;
