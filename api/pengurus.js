import express from 'express';
import Pengurus from '../models/pengurus.js';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Hanya admin yang bisa mengakses rute ini
router.get('/', authMiddleware, checkRole('admin'), async (req, res) => {
  try {
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
    return res.status(500).json({ message: 'Kesalahan server: ' + err.message });
  }
});

// Tambahkan middleware serupa untuk rute POST, PUT, DELETE
router.post('/', authMiddleware, checkRole('admin'), async (req, res) => {
  // ... kode existing ...
});

router.put('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  // ... kode existing ...
});

router.delete('/:id', authMiddleware, checkRole('admin'), async (req, res) => {
  // ... kode existing ...
});

router.all('*', (req, res) => {
  return res.status(405).json({ message: 'Metode HTTP tidak diizinkan' });
});

export default router;