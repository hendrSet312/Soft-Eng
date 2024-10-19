const express = require('express');
const User = require('../models/User');  // Require User model
const bcrypt = require('bcryptjs');

const router = express.Router();

// Sign-up Route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ firstName, lastName, email, phoneNumber, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;  // Export the router for use in server.js
