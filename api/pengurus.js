import { dbConnect } from '../lib/dbConnect.js';
import Pengurus from '../models/pengurus.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method, query, body } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const pengurus = await Pengurus.findById(query.id);
          if (!pengurus) return res.status(404).json({ message: 'Pengurus not found' });
          return res.status(200).json(pengurus);
        }
        const all = await Pengurus.find();
        return res.status(200).json(all);

      case 'POST':
        const created = await Pengurus.create(body);
        return res.status(201).json(created);

      case 'PUT':
        if (!query.id) return res.status(400).json({ message: 'Missing id in query' });
        const updated = await Pengurus.findByIdAndUpdate(query.id, body, { new: true });
        return res.status(200).json(updated);

      case 'DELETE':
        if (!query.id) return res.status(400).json({ message: 'Missing id in query' });
        await Pengurus.findByIdAndDelete(query.id);
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
