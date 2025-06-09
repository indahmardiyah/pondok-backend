const mongoose = require('mongoose');
require('dotenv').config(); // Memuat variabel dari file .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Terhubung ke MongoDB Atlas');
  } catch (err) {
    console.error('❌ Gagal konek ke MongoDB:', err.message);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

module.exports = connectDB;
