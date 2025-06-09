const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load variabel dari .env

const connectDB = require('./config/db');
const santriRoutes = require('./routes/santri');
const pengurusRoutes = require('./routes/pengurus');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 4000;

// Koneksi ke MongoDB
connectDB();

// Konfigurasi CORS untuk mengizinkan frontend dari Vercel
const allowedOrigins = ['https://frontend-pondok.vercel.app'];
// CORS untuk mengizinkan frontend mengakses API
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk upload foto
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Static files dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/api/santri', santriRoutes);
app.use('/api/pengurus', pengurusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Middleware Error Handling
app.use((err, req, res, next) => {
  console.error('Terjadi error:', err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan di server.' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
