const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    maxlength: 60
  },
  image: {
    type: String
  },
  content: {
    type: String,
    minlength: 2,
    maxlength: 280,
    required: true
  },
  banner: {
    type: String
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
