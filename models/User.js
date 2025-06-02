// models/User.js - User schema
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  naam: {
    type: String,
    required: true,
    trim: true
  },
  adres: {
    type: String,
    required: true,
    trim: true
  },
  postcode: {
    type: String,
    required: true,
    trim: true
  },
  woonplaats: {
    type: String,
    required: true,
    trim: true
  },
  land: {
    type: String,
    required: true,
    trim: true
  },
  telefoonnummer: {
    type: String,
    trim: true,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
