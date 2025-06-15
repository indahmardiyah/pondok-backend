// lib/dbConnect.js
import mongoose from 'mongoose';

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI tidak ditemukan di environment');

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'pondokdb', // Sesuaikan jika pakai nama DB lain
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log('Berhasil koneksi ke MongoDB
