import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'pengurus', 'orangtua'],
    required: true
  },
  nama: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;