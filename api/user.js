import express from 'express';
import { dbConnect } from '../lib/dbConnect.js';
import User from '../models/user.js';

const router = express.Router();

router.use(async (req, res, next) => {
  await dbConnect();
  next();
});

// Konfigurasi CORS
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend-pondok.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

router.options('/', (req, res) => {
  res.status(200).end();
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.use((req, res) => {
  res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
});

export default router;