import { Router } from 'express';
import { getAction, postAction } from '../services/appsScriptServer.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/health', requireAuth, requireRole('admin'), async (_req, res) => {
  try { res.json(await getAction('health')); } catch (error) { res.status(503).json({ ok: false, fallback: true, error: error.message }); }
});
router.get('/students', requireAuth, requireRole('admin'), async (_req, res) => {
  try { res.json(await getAction('students')); } catch (error) { res.status(503).json({ ok: false, fallback: true, error: error.message }); }
});
router.get('/student/:studentId', requireAuth, requireRole('admin'), async (req, res) => {
  try { res.json(await getAction('student', { studentId: req.params.studentId })); } catch (error) { res.status(503).json({ ok: false, fallback: true, error: error.message }); }
});
router.post('/attendance', requireAuth, requireRole('admin', 'teacher'), async (req, res) => res.json(await postAction('updateAttendance', req.body)));
router.post('/homework', requireAuth, requireRole('admin', 'teacher'), async (req, res) => res.json(await postAction('updateHomework', req.body)));
router.post('/students', requireAuth, requireRole('admin'), async (req, res) => res.json(await postAction('upsertStudent', req.body)));

export default router;
