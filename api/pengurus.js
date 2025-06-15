import express from 'express';
import Pengurus from '../models/pengurus.js';
import { authMiddleware, checkRole } from '../middleware/auth.js';
import { dbConnect } from '../lib/dbConnect.js';

const router = express.Router();

router.get('/', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    if (req.query.id) {
      const pengurus = await Pengurus.findById(req.query.id);
      if (!pengurus) {
        return res.status(404).json({ message: 'Pengurus tidak ditemukan' });
      }
      return res.status(200).json(pengurus);
    }
    const allPengurus = await Pengurus.find();
    return res.status(200).json(allPengurus);
  } catch (err) {
    console.error('Get pengurus error:', err);
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.post('/', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    const { nama, jabatan, asal } = req.body;
    if (!nama || !jabatan || !asal) {
      return res.status(400).json({ message: 'Nama, jabatan, dan asal wajib diisi' });
    }
    const newPengurus = new Pengurus({
      ...req.body,
      foto: req.body.foto || 'fotodefault.jpg'
    });
    await newPengurus.save();
    return res.status(201).json({ message: 'Pengurus berhasil ditambahkan', data: newPengurus });
  } catch (err) {
    console.error('Add pengurus error:', err);
    return res.status(400).json({ message: 'Gagal menambahkan pengurus: ' + err.message });
  }
});

router.put('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    const { nama, jabatan, asal } = req.body;
    if (!nama || !jabatan || !asal) {
      return res.status(400).json({ message: 'Nama, jabatan, dan asal wajib diisi' });
    }
    const updatedPengurus = await Pengurus.findByIdAndUpdate(
      req.params.id,
      { ...req.body, foto: req.body.foto || 'fotodefault.jpg' },
      { new: true, runValidators: true }
    );
    if (!updatedPengurus) {
      return res.status(404).json({ message: 'Pengurus tidak ditemukan' });
    }
    return res.status(200).json({ message: 'Pengurus berhasil diperbarui', data: updatedPengurus });
  } catch (err) {
    console.error('Update pengurus error:', err);
    return res.status(400).json({ message: 'Gagal memperbarui pengurus: ' + err.message });
  }
});

router.delete('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
    await dbConnect();
    const deletedPengurus = await Pengurus.findByIdAndDelete(req.params.id);
    if (!deletedPengurus) {
      return res.status(404).json({ message: 'Pengurus tidak ditemukan' });
    }
    return res.status(200).json({ message: 'Pengurus berhasil dihapus' });
  } catch (err) {
    console.error('Delete pengurus error:', err);
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

router.all('*', (req, res) => {
  return res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
});

export default router;