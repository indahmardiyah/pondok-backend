const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Santri = require('../models/santri');

// Konfigurasi multer untuk upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder tempat menyimpan gambar
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ GET semua santri
router.get('/', async (req, res) => {
  try {
    const data = await Santri.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET santri berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const santri = await Santri.findById(req.params.id);
    if (!santri) return res.status(404).json({ message: 'Santri tidak ditemukan' });
    res.json(santri);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST tambah data santri
router.post('/api/santri', upload.single('foto'), async (req, res) => {
  try {
    const namaFileFoto = req.file ? req.file.filename : 'fotodefault.jpg';

    const newSantri = new Santri({
      nama: req.body.nama,
      umur: req.body.umur,
      asal: req.body.asal,
      namaAyah: req.body.namaAyah,
      namaIbu: req.body.namaIbu,
      jumlahHafalan: req.body.jumlahHafalan,
      foto: namaFileFoto,
    });

    await newSantri.save();
    res.status(201).json({ message: 'Santri berhasil ditambahkan.' });
  } catch (err) {
    console.error('Error tambah santri:', err);
    res.status(400).json({ message: 'Gagal menambahkan santri.' });
  }
});

// ✅ PUT update data santri
router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    const updateData = {
      nama: req.body.nama,
      umur: parseInt(req.body.umur),
      asal: req.body.asal,
      namaAyah: req.body.namaAyah,
      namaIbu: req.body.namaIbu,
      jumlahHafalan: req.body.jumlahHafalan
    };

    // Jika user upload foto baru
    if (req.file) {
      updateData.foto = req.file.filename;
    }

    // Update dan kembalikan data baru
    const updatedSantri = await Santri.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // return data terbaru
        runValidators: true
      }
    );

    if (!updatedSantri) {
      return res.status(404).json({ message: 'Santri tidak ditemukan' });
    }

    res.status(200).json({ message: 'Santri berhasil diperbarui', data: updatedSantri });

  } catch (err) {
    console.error('Gagal update santri:', err.message);
    res.status(500).json({ message: 'Gagal update data' });
  }
});

// ✅ DELETE hapus santri
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Santri.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Santri tidak ditemukan' });
    }
    res.json({ message: 'Santri berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
