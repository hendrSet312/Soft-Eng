const express = require('express');
const verifyToken = require('./middleware');
const User = require('../models/User');
const router = express.Router();

router.get('/dashboard', verifyToken, (req, res) => {
  const { _id, firstName, lastName, email } = req.user;
  return res.json({
    message: 'Welcome to your dashboard',
    id:_id,
    firstName:firstName,
    lastName:lastName,
    email:email
  });
});

module.exports = router