import mongoose from 'mongoose';

const santriSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kelas: { type: String, required: true },
  umur: { type: Number },
  asal: { type: String },
  namaAyah: { type: String },
  namaIbu: { type: String },
  jumlahHafalan: { type: Number },
  foto: { type: String, default: 'fotodefault.jpg' }
});

const Santri = mongoose.models.Santri || mongoose.model('Santri', santriSchema);
export default Santri;