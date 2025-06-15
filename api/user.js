import express from 'express';
import { dbConnect } from '../lib/dbConnect.js';
import User from '../models/user.js';

const router = express.Router();

// Connect to MongoDB before processing requests
router.use(async (req, res, next) => {
  await dbConnect();
  next();
});

// GET /api/user
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

// Handle unsupported methods
router.use((req, res) => {
  res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
});

export default router;