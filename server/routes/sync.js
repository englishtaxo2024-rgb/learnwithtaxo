import { Router } from 'express';
import { getDataSourceStatus, syncSource } from '../services/googleSheetsServer.js';

const router = Router();
router.post('/curriculum', async (_req, res) => res.json(await syncSource('curriculum')));
router.post('/schedule', async (_req, res) => res.json(await syncSource('schedule')));
router.post('/new-applications', async (_req, res) => res.json(await syncSource('new-applications')));
router.post('/all', async (_req, res) => res.json({ results: [await syncSource('curriculum'), await syncSource('schedule'), await syncSource('new-applications')] }));

export default router;
