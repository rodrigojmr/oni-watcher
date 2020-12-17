'use strict';

const express = require('express');
const User = require('../models/user_model');
const Post = require('./../models/post');
const ObjectID = require('mongodb').ObjectID;
const LibEntry = require('../models/library');
const routeGuard = require('./../middleware/route-guard');
const fileUploader = require('../cloudinary-configuration');
const Follow = require('../models/follow');

const profileRouter = new express.Router();

profileRouter.get('/settings', routeGuard, (req, res, next) => {
  res.render('profile/settings');
});

const twoFilesUploader = fileUploader.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);
profileRouter.post(
  '/settings',
  routeGuard,
  twoFilesUploader,
  async (req, res, next) => {
    console.log(req.body);
    const { username, email, tagline } = req.body;

    try {
      let avatar, banner;

      const modifiedUser = {
        username,
        email,
        tagline
      };

      if (await req.files.avatar) {
        modifiedUser.avatar = await req.files.avatar[0].path;
      }
      if (await req.files.banner) {
        modifiedUser.banner = await req.files.banner[0].path;
      }

      const id = ObjectID(req.session.passport.user);
      await User.findByIdAndUpdate(id, modifiedUser);
      res.redirect(`/profile/${username}`);
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.get('/:username', async (req, res, next) => {
  const username = req.params.username;

  try {
    //Find and populate user info
    const userPublic = await User.findOne({ username }).populate(
      'post feed followers following favorites'
    );
    const library = await LibEntry.find({
      user: userPublic._id
    }).populate('anime');

    const currentlyWatching = await LibEntry.find({
      $and: [
        {
          user: userPublic._id,
          status: 'currently-watching'
        }
      ]
    }).populate('anime');

    const completed = await LibEntry.find({
      $and: [
        {
          user: userPublic._id,
          status: 'completed'
        }
      ]
    }).populate('anime');

    // Get following
    const usersThatPublicUserFollows = await userPublic.following;

    // Get followers
    const usersThatFollowPublicUser = await userPublic.followers;

    // Get friends/mutuals
    // const followsIds = usersThatPublicUserFollows.map(e => e.)
    const friends = usersThatPublicUserFollows.filter(element =>
      element.following.includes(userPublic._id)
    );

    // Check if logged in users follows public user
    let isFollowing, ownProfile;
    if (req.user) {
      isFollowing = userPublic.followers.some(
        follower => follower._id.toString() === req.session.passport.user
      );
      ownProfile = userPublic._id.toString() === req.session.passport.user;
    }

    const data = {
      userPublic: userPublic,
      currentlyWatching,
      completed,
      isFollowing,
      following: usersThatPublicUserFollows,
      followers: usersThatFollowPublicUser,
      friends,
      ownProfile
    };

    res.render('profile/display', data);
  } catch (error) {
    next(error);
  }
});

module.exports = profileRouter;
