'use strict';

const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    required: true
  }
});

const anime = mongoose.model('Anime', animeSchema);

module.exports = anime;
