const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET semua user
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // tidak tampilkan password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
