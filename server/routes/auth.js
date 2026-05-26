import { Router } from 'express';
import { audit, createToken, loadDb, mutateDb, publicUser } from '../services/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const db = await loadDb();
  const user = db.users.find((item) => item.email === email && item.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  const token = createToken();
  db.sessions[token] = { userId: user.id, createdAt: new Date().toISOString() };
  audit(db, user, 'auth.login', { email });
  await mutateDb((stored) => {
    stored.sessions[token] = db.sessions[token];
    stored.audit = db.audit;
    return true;
  });
  res.json({ token, user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post('/logout', requireAuth, async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  await mutateDb((db) => {
    delete db.sessions[token];
    audit(db, req.user, 'auth.logout');
    return true;
  });
  res.json({ ok: true });
});

export default router;
