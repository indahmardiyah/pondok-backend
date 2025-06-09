const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const santriRoutes = require('./routes/santri');
const pengurusRoutes = require('./routes/pengurus');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// Hanya koneksi ke DB jika sedang tidak dijalankan sebagai test
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/santri', santriRoutes);
app.use('/api/pengurus', pengurusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Terjadi error:', err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan di server.' });
});

// Ekspor app agar digunakan Vercel
module.exports = app;

// Untuk pengembangan lokal saja
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}
