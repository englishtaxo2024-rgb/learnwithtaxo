import { Router } from 'express';
import { sendEmail } from '../services/emailServer.js';

const router = Router();
router.post('/send', async (req, res) => res.json(await sendEmail(req.body)));
export default router;
