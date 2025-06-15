import express from 'express';
import cors from 'cors';
import { dbConnect } from '../lib/dbConnect.js'; // Changed to named import
import auth from './auth.js';
import pengurus from './pengurus.js';
import santri from './santri.js';
import user from './user.js';

const app = express();

app.use(cors({
  origin: 'https://frontend-pondok.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

dbConnect().catch(err => console.error('Database connection error:', err));

app.use('/api/auth', auth);
app.use('/api/pengurus', pengurus);
app.use('/api/santri', santri);
app.use('/api/user', user);

app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

export default app;