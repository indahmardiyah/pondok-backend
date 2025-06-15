import mongoose from 'mongoose';

const pengurusSchema = new mongoose.Schema({
  nama: { type: String, required: true, minlength: 2 },
  jabatan: { type: String, required: true, minlength: 2 },
  asal: { type: String, required: true, minlength: 2 },
  namaAyah: { type: String },
  namaIbu: { type: String },
  jumlahSaudara: { type: Number, min: 0 },
  anakKe: { type: Number, min: 1 },
  foto: { type: String, default: 'fotodefault.jpg' }
});

const Pengurus = mongoose.models.Pengurus || mongoose.model('Pengurus', pengurusSchema);
export default Pengurus;