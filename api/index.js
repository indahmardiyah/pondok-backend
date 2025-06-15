import express from 'express';
import cors from 'cors';
import { dbConnect } from '../lib/dbConnect.js';
import auth from './auth.js';
import pengurus from './pengurus.js';
import santri from './santri.js';
import user from './user.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://frontend-pondok.vercel.app', 'http://localhost:3000'], // Add localhost for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Connect to database before handling API routes
app.use('/api', async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// API routes
app.use('/api/auth', auth);
app.use('/api/pengurus', pengurus);
app.use('/api/santri', santri);
app.use('/api/user', user);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default app;