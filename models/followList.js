const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const followListSchema = new mongoose.Schema({
    followerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    followedListId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const FollowList = mongoose.model('FollowList', followListSchema);
module.exports = FollowList;
