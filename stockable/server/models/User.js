const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Define the schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String, 
    required: true, 
    trim : true
  },
  lastName: {
    type: String, 
    required: true, 
    trim : true,
  },email: {
    type: String, 
    required: true, 
    unique: true, 
    trim : true,
    lowercase:true,
    validate : {
      validator : (value) => validator.isEmail(value),
      message : 'Not a valid email'
    }
  },phoneNumber : {
    type: String, 
    required: true,
    trim : true 
  },
  password: { type: String, required: true, trim : true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Specify the collection name
const User = mongoose.model('User', userSchema, 'Users');  // Explicitly set the collection name to 'Users'
module.exports = User;
