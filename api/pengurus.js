import {dbConnect} from '../lib/dbConnect.js';
import Pengurus from '../models/pengurus.js';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (req.query.id) {
          const pengurus = await Pengurus.findById(req.query.id);
          if (!pengurus) return res.status(404).json({ message: 'Data tidak ditemukan' });
          return res.status(200).json(pengurus);
        } else {
          const all = await Pengurus.find();
          return res.status(200).json(all);
        }
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }

    case 'POST':
      try {
        const newData = new Pengurus({
          ...req.body,
          foto: 'fotodefault.jpg'
        });
        await newData.save();
        return res.status(201).json({ message: 'Pengurus berhasil ditambahkan' });
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }

    case 'PUT':
      try {
        const updated = await Pengurus.findByIdAndUpdate(
          req.query.id,
          { ...req.body },
          { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Data tidak ditemukan' });
        return res.status(200).json({ message: 'Berhasil diperbarui', data: updated });
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }

    case 'DELETE':
      try {
        const deleted = await Pengurus.findByIdAndDelete(req.query.id);
        if (!deleted) return res.status(404).json({ message: 'Data tidak ditemukan' });
        return res.status(200).json({ message: 'Data berhasil dihapus' });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }

    default:
      return res.status(405).json({ message: 'Method tidak diizinkan' });
  }
}
