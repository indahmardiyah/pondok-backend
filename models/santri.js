const mongoose = require('mongoose');

const santriSchema = new mongoose.Schema({
  nama: String,
  umur: Number,
  asal: String,
  namaAyah: String,
  namaIbu: String,
  jumlahHafalan: Number,
  foto: String,
});

module.exports = mongoose.model('Santri', santriSchema);
