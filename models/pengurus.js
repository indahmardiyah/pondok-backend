import mongoose from 'mongoose';

const pengurusSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jabatan: { type: String, required: true },
  asal: { type: String, required: true },
  namaAyah: { type: String },
  namaIbu: { type: String },
  jumlahSaudara: { type: Number },
  anakKe: { type: Number },
  foto: { type: String, default: 'fotodefault.jpg' }
});

const Pengurus = mongoose.models.Pengurus || mongoose.model('Pengurus', pengurusSchema);
export default Pengurus;
