import dbConnect from '../lib/dbConnect.js';
import auth from './auth.js';
import pengurus from './pengurus.js';
import santri from './santri.js';
import user from './user.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.url.startsWith('/api/auth')) return auth(req, res);
  if (req.url.startsWith('/api/pengurus')) return pengurus(req, res);
  if (req.url.startsWith('/api/santri')) return santri(req, res);
  if (req.url.startsWith('/api/user')) return user(req, res);

  res.status(404).json({ message: 'Route not found' });
}
