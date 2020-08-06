

'use strict';

const { Router } = require('express');
const router = new Router();
const Follow = require("../models/Follow");
const User = require("../models/user_model");
const routeGuard = require('./../middleware/route-guard');

router.get("/following", routeGuard, (req, res, next) => {
  Follow.find({ followerId: req.user.id })
    .populate("followedId")
    .then(users => {
      users.map(u => u.followedId);
      let sad;
      if (users.length === 0) {
        sad = true;
      }
      res.render("follow", { following: true, users, sad });
    })
    .catch(error => next(error));
});

router.get("/following/:id", routeGuard, (req, res, next) => {
  Follow.find({ followerId: req.body.id })
    .populate("followedId", "followerId")
    .then(users => {
      users.map(u => u.followedId);
      res.render("follow", { following: true, users});
    })
    .catch(error => next(error));
});

router.get("/followers", routeGuard, (req, res, next) => {
  Follow.find({ followedId: req.user.id })
    .populate("followerId")
    .then(users => {
    users.map(u => u.followerId);
      let sad2;
      if (users.length === 0) {
        sad2 = true;
      }
      res.render("follow", { following: false, users, sad2 });
    })
    .catch(error => next(error));
});

router.get("/followers/:id", routeGuard,  (req, res, next) => {
  Follow.find({ followedId: req.body.id })
    .populate("followerId","followerId")
    .then(users => {
    users.map(u => u.followerId);
      res.render("follow", { following: false, users, user: users[0].followedId });
    })
    .catch(error => next(error));
});

router.get("/follow/:id", routeGuard, (req,res,next)=>{
  const followedId=req.params.id;
  const followerId=req.user.id;
  Follow.create({followerId,followedId})
  .then(() => {
    User.findByIdAndUpdate(followerId,{$inc:{following:1}})
    .then(() => {
      User.findByIdAndUpdate(followedId,{$inc:{followers:1}})
      .then(() => {
        res.redirect( req.get('referer'));
      }).catch(error => next(error));
    }).catch(error => next(error));
  }).catch(error => next(error));
});


router.get("/follow/:id/delete", routeGuard, (req,res,next) => {
  const followedId = req.params.id;
  const followerId = req.user.id;
  Follow.findOneAndDelete({$and:[{followerId}, {followedId}]})
  .then(() => {
    User.findByIdAndUpdate(followerId, {$inc:{following:-1}})
    .then(() => {
      User.findByIdAndUpdate(followedId, {$inc:{followers:-1}})
      .then(() => {
         res.redirect(req.get('referer'));
      }).catch(error => next(error));
    }).catch(error => next(error));
  }).catch(error => next(error));
});



  module.exports = router;
  