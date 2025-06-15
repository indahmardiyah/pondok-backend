import mongoose from 'mongoose';

const santriSchema = new mongoose.Schema({
  nama: { type: String, required: true, minlength: 2 },
  umur: { type: Number, required: true, min: 5 },
  asal: { type: String, required: true, minlength: 2 },
  kelas: { type: String }, // Ditambahkan sebagai opsional
  namaAyah: { type: String },
  namaIbu: { type: String },
  jumlahHafalan: { type: Number, min: 0 },
  foto: { type: String, default: 'fotodefault.jpg' }
});

const Santri = mongoose.models.Santri || mongoose.model('Santri', santriSchema);
export default Santri;