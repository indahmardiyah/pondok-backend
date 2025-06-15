import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbConnect } from '../lib/dbConnect.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    await dbConnect();
    const { username, password, role, nama, email } = req.body;

    if (!username || !password || !role || !nama) {
      return res.status(400).json({ message: 'Username, password, role, dan nama wajib diisi' });
    }
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ message: 'Username harus antara 3-20 karakter' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }
    if (!['admin', 'pengurus', 'orangtua'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Email tidak valid' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role, nama, email });
    await newUser.save();

    return res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    await dbConnect();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Konfigurasi server tidak lengkap' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.all('*', (req, res) => {
  return res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
});

export default router;