import mongoose from 'mongoose';

const pengurusSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jabatan: { type: String, required: true },
  asal: { type: String, required: true },
  namaAyah: String,
  namaIbu: String,
  jumlahSaudara: Number,
  anakKe: Number,
  foto: { type: String, default: 'fotodefault.jpg' }
});

const Pengurus = mongoose.models.Pengurus || mongoose.model('Pengurus', pengurusSchema);
export default Pengurus;
