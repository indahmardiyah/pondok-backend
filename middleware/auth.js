import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'rahasia_super_aman';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
}

export function checkRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.status(403).json({ message: 'Akses ditolak' });
    next();
  };
}