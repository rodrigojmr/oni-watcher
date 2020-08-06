const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    followerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    followedId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Follow = mongoose.model('Follow', followSchema);
module.exports = Follow;
