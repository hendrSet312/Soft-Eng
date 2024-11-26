const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/Auth'); 
const dashboardRoutes = require('./routes/dashboard');

require('dotenv').config();  

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
  secret : process.env.JWT_SECRET,
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
app.use('/api', authRoutes);
app.use('/dashboard',dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
