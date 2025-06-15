import express from 'express';
import cors from 'cors';
import auth from './auth.js';
import pengurus from './pengurus.js';
import santri from './santri.js';
import user from './user.js';

const app = express();

app.use(cors({
  origin: ['https://frontend-pondok.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/pengurus', pengurus);
app.use('/api/santri', santri);
app.use('/api/user', user);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

export default app;