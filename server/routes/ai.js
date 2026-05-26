import { Router } from 'express';
import { scoreWithAi } from '../services/openAiServer.js';

const router = Router();
router.post('/score', async (req, res) => res.json(await scoreWithAi(req.body)));
export default router;
