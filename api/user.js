import {dbConnect} from '../lib/dbConnect.js';
import User from '../models/user.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const users = await User.find({}, '-password');
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }
}
