import { userFromSession } from '../services/secureAuth.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const user = await userFromSession(token);
  if (!user) return res.status(401).json({ error: 'Authentication required' });
  req.user = user;
  req.token = token;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
