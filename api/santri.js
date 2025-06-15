import { dbConnect } from '../lib/dbConnect.js';
import Santri from '../models/santri.js';

import Cors from 'cors';
import initMiddleware from '../lib/initMiddleware.js';

// Inisialisasi middleware CORS
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: 'https://frontend-pondok.vercel.app',
    credentials: true,
  })
);

export default async function handler(req, res) {
  await cors(req, res);       // ⬅️ Tambahkan ini di paling atas
  await dbConnect();
  const { method, query, body } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const santri = await Santri.findById(query.id);
          if (!santri) return res.status(404).json({ message: 'Santri not found' });
          return res.status(200).json(santri);
        }
        const all = await Santri.find();
        return res.status(200).json(all);

      case 'POST':
        const created = await Santri.create(body);
        return res.status(201).json(created);

      case 'PUT':
        if (!query.id) return res.status(400).json({ message: 'Missing id in query' });
        const updated = await Santri.findByIdAndUpdate(query.id, body, { new: true });
        return res.status(200).json(updated);

      case 'DELETE':
        if (!query.id) return res.status(400).json({ message: 'Missing id in query' });
        await Santri.findByIdAndDelete(query.id);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
