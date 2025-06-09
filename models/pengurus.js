const mongoose = require('mongoose');

const pengurusSchema = new mongoose.Schema({
  nama: String,
  jabatan: String,
  asal: String,
  namaAyah: String,
  namaIbu: String,
  jumlahSaudara: Number,
  anakKe: Number,
  foto: String,
});

module.exports = mongoose.model('Pengurus', pengurusSchema);
