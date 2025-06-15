import express from 'express';
import User from '../models/user.js';
import { authMiddleware, checkRole } from '../middleware/auth.js';
import { dbConnect } from '../lib/dbConnect.js';

const router = express.Router();

router.get('/', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    const users = await User.find({}, '-password');
    return res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.all('*', (req, res) => {
  return res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
});

export default router;