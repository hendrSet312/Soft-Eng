const express = require('express');
const session = require('express-session');
const User = require('../models/User');  // Require User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

// login
router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'password' });
      }

      req.session.userId = existingUser._id;
      const token = jwt.sign({ id: existingUser._id }, 'secret-key', { expiresIn: '1h' });
      return res.status(201).json({ message: 'Login success', token });

    } else {
      return res.status(404).json({ message: 'Invalid NGAWI' });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', (req,res) => {
  req.session.destroy( err => {
    if(err){
      return res.status(500).json({message : 'Logout failed'});
    }
    res.clearCookie('connect.sid');
    return res.status(201).json({message : 'logout success'});
  });
});

module.exports = router;  // Export the router for use in server.js
