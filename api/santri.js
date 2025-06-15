import {dbConnect} from '../lib/dbConnect.js';
import Santri from '../models/santri.js';

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (req.query.id) {
          const data = await Santri.findById(req.query.id);
          if (!data) return res.status(404).json({ message: 'Santri tidak ditemukan' });
          return res.status(200).json(data);
        } else {
          const all = await Santri.find();
          return res.status(200).json(all);
        }
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }

    case 'POST':
      try {
        const newSantri = new Santri({
          ...req.body,
          foto: 'fotodefault.jpg'
        });
        await newSantri.save();
        return res.status(201).json({ message: 'Santri berhasil ditambahkan' });
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }

    case 'PUT':
      try {
        const updated = await Santri.findByIdAndUpdate(
          req.query.id,
          { ...req.body },
          { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Santri tidak ditemukan' });
        return res.status(200).json({ message: 'Santri berhasil diperbarui', data: updated });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }

    case 'DELETE':
      try {
        const deleted = await Santri.findByIdAndDelete(req.query.id);
        if (!deleted) return res.status(404).json({ message: 'Santri tidak ditemukan' });
        return res.status(200).json({ message: 'Santri berhasil dihapus' });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }

    default:
      return res.status(405).json({ message: 'Method tidak diizinkan' });
  }
}
