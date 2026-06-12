import { Router } from 'express';
import { scoreWithAi } from '../services/openAiServer.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.post('/score', requireAuth, requireRole('admin', 'teacher'), async (req, res, next) => {
  try {
    res.json(await scoreWithAi(req.body));
  } catch (error) {
    next(error);
  }
});
export default router;
