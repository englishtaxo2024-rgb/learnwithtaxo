import { Router } from 'express';
import { getAction, postAction } from '../services/appsScriptServer.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try { res.json(await getAction('health')); } catch (error) { res.status(503).json({ ok: false, fallback: true, error: error.message }); }
});
router.get('/students', async (_req, res) => {
  try { res.json(await getAction('students')); } catch (error) { res.status(503).json({ ok: false, fallback: true, error: error.message }); }
});
router.get('/student/:studentId', async (req, res) => {
  try { res.json(await getAction('student', { studentId: req.params.studentId })); } catch (error) { res.status(503).json({ ok: false, fallback: true, error: error.message }); }
});
router.post('/attendance', async (req, res) => res.json(await postAction('updateAttendance', req.body)));
router.post('/homework', async (req, res) => res.json(await postAction('updateHomework', req.body)));
router.post('/students', async (req, res) => res.json(await postAction('upsertStudent', req.body)));

export default router;
