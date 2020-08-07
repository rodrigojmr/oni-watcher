'use strict';

const { Router } = require('express');
const router = new Router();
const Follow = require('../models/follow');
const User = require('../models/user_model');
const routeGuard = require('./../middleware/route-guard');

// Separate page for all users public user follows
router.get('/:username/following', routeGuard, async (req, res, next) => {
  const username = req.params.username;

  try {
    const userPublic = await User.findOne({ username }).populate('following');

    const usersThatPublicUserFollows = await userPublic.following;

    const data = { userPublic, usersThatPublicUserFollows };

    res.render('profile/following', data);
  } catch (error) {
    next(error);
  }
});

router.get('/:username/followers', routeGuard, async (req, res, next) => {
  const username = req.params.username;

  try {
    const userPublic = await User.findOne({ username }).populate('followers');

    const followers = await userPublic.followers;

    const data = { userPublic, followers };

    res.render('profile/following', data);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/:username/follow', routeGuard, async (req, res, next) => {
  const userId = req.user._id;

  const username = req.params.username;

  try {
    const userPublic = await User.findOne({ username });
    const user = await User.findById(userId);

    userPublic.followers.push(userId);
    user.following.push(userPublic._id);

    userPublic.save();
    user.save();

    res.redirect(`/profile/${username}`);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/profile/:username/unfollow',
  routeGuard,
  async (req, res, next) => {
    const userId = req.user._id;
    const username = req.params.username;

    try {
      const userPublic = await User.findOne({ username });
      const user = await User.findById(userId);

      const yourIndexInUsersFollowers = userPublic.followers.indexOf(userId);
      const indexOfPublicUser = user.following.indexOf(userPublic._id);

      userPublic.followers.splice(yourIndexInUsersFollowers, 1);
      user.following.splice(indexOfPublicUser, 1);

      userPublic.save();
      user.save();

      res.redirect(`/profile/${username}`);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
