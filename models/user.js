import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'pengurus', 'orangtua'],
    required: true
  },
  nama: {
    type: String,
    required: true
  },
  email: String
});

// Hindari duplikasi model saat fungsi dijalankan ulang di serverless environment
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
