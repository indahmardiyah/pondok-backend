import dbConnect from '../lib/dbConnect.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  // ✅ Atur CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend-pondok.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight response
  }

  // ✅ Handle routes
  const { method, url } = req;

  if (method === 'POST') {
    if (url.endsWith('/register')) {
      return await handleRegister(req, res);
    } else if (url.endsWith('/login')) {
      return await handleLogin(req, res);
    } else {
      return res.status(404).json({ message: 'Route tidak ditemukan' });
    }
  }

  return res.status(405).json({ message: 'Method tidak diizinkan' });
}

// ✅ Fungsi Register
async function handleRegister(req, res) {
  try {
    const { username, password, role, nama, email } = req.body;

    if (!username || !password || !role || !nama) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'Username sudah terdaftar' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed, role, nama, email });
    await newUser.save();

    return res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// ✅ Fungsi Login
async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'rahasia_super_aman',
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
