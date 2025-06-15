import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

let cachedConnection = null;

export async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}