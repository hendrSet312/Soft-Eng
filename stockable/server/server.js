const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/Auth');  // Require Auth.js (No .js extension needed)
require('dotenv').config();  // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
  secret : 'secret-key',
  resave: false,
  saveUninitialized : true,
  cookie : {secure : false}
}));

// Connect to MongoDB using environment variable
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
