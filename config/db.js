const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('❌ MONGODB_URI belum diatur di environment variables');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Terhubung ke MongoDB Atlas');
  } catch (err) {
    console.error('❌ Gagal konek ke MongoDB:', err.message);
    process.exit(1); // Menghentikan proses jika koneksi gagal
  }
};

module.exports = connectDB;
