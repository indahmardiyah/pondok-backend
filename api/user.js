import { dbConnect } from '../lib/dbConnect.js';
import User from '../models/user.js';
import Cors from 'cors';
import initMiddleware from '../lib/initMiddleware.js';

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: 'https://frontend-pondok.vercel.app',
    credentials: true,
  })
);
export default async function handler(req, res) {
  await cors(req, res);
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const users = await User.find();
        return res.status(200).json(users);
      } catch (err) {
        return res.status(500).json({ message: 'Gagal mengambil data user' });
      }

    case 'PUT':
      try {
        const { _id, ...updateData } = req.body;

        if (!_id) {
          return res.status(400).json({ message: 'Missing _id' });
        }

        const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedUser) {
          return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        return res.status(200).json({ message: 'User berhasil diperbarui', user: updatedUser });
      } catch (err) {
        return res.status(500).json({ message: 'Gagal memperbarui user', error: err.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ message: `Method ${method} tidak diizinkan` });
  }
}
