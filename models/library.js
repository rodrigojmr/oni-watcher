'use strict';

const mongoose = require('mongoose');

const libEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true
  },
  status: {
    type: String,
    enum: [
      'plan-to-watch',
      'on-hold',
      'dropped',
      'completed',
      'currently-watching'
    ],
    default: 'plan-to-watch',
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

const LibbEntry = mongoose.model('LibEntry', libEntrySchema);

module.exports = LibbEntry;
