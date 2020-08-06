'use strict';

const express = require('express');
const User = require('../models/user_model');
const Post = require('./../models/post');
const ObjectID = require('mongodb').ObjectID;
const routeGuard = require('./../middleware/route-guard');

const postRouter = new express.Router();

postRouter.post(
  '/profile/:username/post',
  routeGuard,
  async (req, res, next) => {
    const username = req.params.username;
    const id = ObjectID(req.session.passport.user);
    const { title, content } = req.body;

    try {
      const createdPost = await Post.create({ creator: id, title, content });
      const userPosted = await User.findById(id);
      const userReceivedPost = await User.findOne({ username });

      console.log(createdPost, userPosted, userReceivedPost);

      userReceivedPost.feed.push(createdPost._id);
      userPosted.posts.push(createdPost._id);
      userPosted.save();
      userReceivedPost.save();
      res.redirect(`/profile/${username}`);
    } catch (error) {
      next(error);
    }
  }
);

postRouter.post(
  '/profile/:username/:postid/delete',
  routeGuard,
  async (req, res, next) => {
    const username = req.params.username;
    const postId = req.params.postid;

    try {
      const createdPost = await Post.findByIdAndDelete(postId);
      const creator = await User.findById(createdPost.creator);
      const userReceivedPost = await User.findOne({ username });

      const indexPostInCreator = creator.posts.indexOf(createdPost._id);
      creator.posts.splice(indexPostInCreator, 1);

      const indexPostInFeed = userReceivedPost.feed.indexOf(createdPost._id);
      userReceivedPost.feed.splice(indexPostInFeed, 1);

      res.redirect(`/profile/${username}`);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = postRouter;
