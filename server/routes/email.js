import { Router } from 'express';
import { sendEmail } from '../services/emailServer.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.post('/send', requireAuth, requireRole('admin'), async (req, res) => res.json(await sendEmail(req.body)));
export default router;
