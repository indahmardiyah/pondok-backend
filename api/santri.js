import express from 'express';
import Santri from '../models/santri.js';
import { authMiddleware, checkRole } from '../middleware/auth.js';
import { dbConnect } from '../lib/dbConnect.js';

const router = express.Router();

router.get('/', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    if (req.query.id) {
      const santri = await Santri.findById(req.query.id);
      if (!santri) {
        return res.status(404).json({ message: 'Santri tidak ditemukan' });
      }
      return res.status(200).json(santri);
    }
    const allSantri = await Santri.find();
    return res.status(200).json(allSantri);
  } catch (err) {
    console.error('Get santri error:', err);
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.post('/', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    const { nama, umur, asal } = req.body;
    if (!nama || !umur || !asal) {
      return res.status(400).json({ message: 'Nama, umur, dan asal wajib diisi' });
    }
    const newSantri = new Santri({
      ...req.body,
      foto: req.body.foto || 'fotodefault.jpg'
    });
    await newSantri.save();
    return res.status(201).json({ message: 'Santri berhasil ditambahkan', data: newSantri });
  } catch (err) {
    console.error('Add santri error:', err);
    return res.status(400).json({ message: 'Gagal menambahkan santri: ' + err.message });
  }
});

router.put('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    const { nama, umur, asal } = req.body;
    if (!nama || !umur || !asal) {
      return res.status(400).json({ message: 'Nama, umur, dan asal wajib diisi' });
    }
    const updatedSantri = await Santri.findByIdAndUpdate(
      req.params.id,
      { ...req.body, foto: req.body.foto || 'fotodefault.jpg' },
      { new: true, runValidators: true }
    );
    if (!updatedSantri) {
      return res.status(404).json({ message: 'Santri tidak ditemukan' });
    }
    return res.status(200).json({ message: 'Santri berhasil diperbarui', data: updatedSantri });
  } catch (err) {
    console.error('Update santri error:', err);
    return res.status(400).json({ message: 'Gagal memperbarui santri: ' + err.message });
  }
});

router.delete('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    const deletedSantri = await Santri.findByIdAndDelete(req.params.id);
    if (!deletedSantri) {
      return res.status(404).json({ message: 'Santri tidak ditemukan' });
    }
    return res.status(200).json({ message: 'Santri berhasil dihapus' });
  } catch (err) {
    console.error('Delete santri error:', err);
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.all('*', (req, res) => {
  return res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
});

export default router;