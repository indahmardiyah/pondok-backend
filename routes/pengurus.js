const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Pengurus = require('../models/pengurus');

// Konfigurasi multer untuk upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploads/'); // folder tempat menyimpan gambar
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ GET: Ambil semua data pengurus
router.get('/', async (req, res) => {
  try {
    const data = await Pengurus.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET by ID: Ambil data pengurus berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const data = await Pengurus.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST tambah pengurus
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const namaFileFoto = req.file ? req.file.filename : 'fotodefault.jpg';

    const newPengurus = new Pengurus({
      nama: req.body.nama,
      jabatan: req.body.jabatan,
      asal: req.body.asal,
      namaAyah: req.body.namaAyah,
      namaIbu: req.body.namaIbu,
      jumlahSaudara: req.body.jumlahSaudara,
      anakKe: req.body.anakKe,
      foto: namaFileFoto
    });

    await newPengurus.save();
    res.status(201).json({ message: 'Pengurus berhasil ditambahkan.' });
  } catch (err) {
    console.error('Error tambah pengurus:', err);
    res.status(400).json({ message: 'Gagal menambahkan pengurus.' });
  }
});

router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    const updatedData = {
      nama: req.body.nama,
      jabatan: req.body.jabatan,
      asal: req.body.asal,
      namaAyah: req.body.namaAyah,
      namaIbu: req.body.namaIbu,
      jumlahSaudara: req.body.jumlahSaudara,
      anakKe: req.body.anakKe
    };

    if (req.file) {
      updatedData.foto = req.file.filename;
    }

    const updated = await Pengurus.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE: Hapus data pengurus berdasarkan ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Pengurus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
