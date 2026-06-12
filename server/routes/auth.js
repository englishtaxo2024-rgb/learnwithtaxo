import { Router } from 'express';
import { audit, mutateDb } from '../services/store.js';
import { loginWithRole, logoutSession } from '../services/secureAuth.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const result = await loginWithRole(req.body || {});
  if (!result.success) return res.status(result.status || 401).json({ error: result.error || 'Login failed' });
  await mutateDb((db) => audit(db, result.user, 'auth.login', { role: result.role }));
  res.json(result);
});

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

router.post('/logout', requireAuth, async (req, res) => {
  await logoutSession(req.token);
  await mutateDb((db) => audit(db, req.user, 'auth.logout'));
  res.json({ ok: true });
});

export default router;
