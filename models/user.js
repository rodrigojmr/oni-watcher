'use strict';

const mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a unique email address.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['User', 'Moderator'],
    required: true,
    default: 'User'
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  },
<<<<<<< HEAD
  status: {
    type: String,
    enum: ['Pending confirmation', 'Active'],
    default: 'Pending confirmation'
  },
  confirmationToken: { 
   type: String  
  } 
=======
  comments: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  posts: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  }
>>>>>>> 91a3870a661bd35efc21adb76bae1c9588a08c6d
});
schema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
module.exports = mongoose.model('User', schema);
