'use strict';

const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Plan to Watch, On Hold, Dropped, Completed, Currently Watching'],
    default: 'Plan to Watch',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number
  }
});

const libEntry = mongoose.model('libEntry', librarySchema);

module.exports = libEntry;
