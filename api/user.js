import dbConnect from '../lib/dbConnect.js';
import User from '../models/user.js';

export default async function handler(req, res) {
  await dbConnect();

  // Konfigurasi CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend-pondok.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const users = await User.find({}, '-password');
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
    }
  }

  return res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
}