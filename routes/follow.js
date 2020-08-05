'use strict';

const express = require("express");
const router = express.Router();
const Follow = require("../models/Follow");
const FollowList = require("../models/followList");
const User = require("../models/User");
const routeGuard = require('./../middleware/route-guard');

router.get("/following", (req, res, next) => {
    Follow.find({ followerId: req.user.id })
      .populate("followedId")
      .then(users => {
        users.map(u => u.followedId);
        let happy;
        if (users.length==0) {
          happy=true;
        }
        res.render("follow", { following: true, users,happy });
      })
      .catch(error => next(error));
  });
  
  router.get("/following/:id", (req, res, next) => {
    Follow.find({ followerId: req.body.id })
      .populate("followedId","followerId")
      .then(users => {
       users.map(u => u.followedId);
        res.render("follow/following", { following: true, users});
      })
      .catch(error => next(error));
  });

  router.get("/followed", (req, res, next) => {
    Follow.find({ followedId: req.user.id })
      .populate("followerId")
      .then(users => {
        users.map(u => u.followerId);
        let sad;
        if (users.length==0) {
        sad = true;
        }
        res.render("follow", { following: false, users, sad});
      })
      .catch(error => next(error));
  });

  router.get("/followed/:id", (req, res, next) => {
    Follow.find({ followedId: req.body.id })
      .populate("followerId","followerId")
      .then(users => {
       users.map(u => u.followerId);
        res.render("follow", { following: false, users,user:users[0].followedId });
      })
      .catch(error => next(error));
  });
  
  router.get("/follow/:id",routeGuard(),(req,res,next)=>{
    const followedId=req.params.id;
    const followerId=req.user.id;
    Follow.create({followerId,followedId})
    .then(() => {
      User.findByIdAndUpdate(followerId,{$inc:{following:1}})
      .then(()=>{
        User.findByIdAndUpdate(followedId,{$inc:{followers:1}})
        .then(()=>{
          res.redirect(req.get('referer'));
        }).catch(error => next(error))
      }).catch(error => next(error))
    }).catch(error => next(error));
  })
  
  router.get("/follow/:id/delete",routeGuard(),(req,res,next)=>{
    const followedId=req.params.id;
    const followerId=req.user.id;
    Follow.findOneAndDelete({$and:[{followerId},{followedId}]})
    .then(()=>{
      User.findByIdAndUpdate(followerId,{$inc:{following:-1}})
      .then(()=>{
        User.findByIdAndUpdate(followedId,{$inc:{followers:-1}})
        .then(()=>{
           res.redirect(req.get('referer'));
        }).catch(error=>next(error))
      }).catch(error=>next(error))
    }).catch(error=>next(error))
  })
  
  router.get("/followList/:id",routeGuard(),(req,res,next)=>{
    const followedListId=req.params.id
    const followerId=req.user.id
    FollowList.create({followerId,followedListId})
    .then((f)=>{
      res.redirect('/list')
    }).catch(error=>next(error));
  });
  
  router.get("/followList/:id/delete",routeGuard(),(req,res,next)=>{
    const followedListId=req.params.id
    const followerId=req.user.id
    FollowList.findOneAndDelete({$and:[{followerId},{followedListId}]})
    .then(()=>{
      res.redirect('/list')
    }).catch(error=>next(error))
  });
  
  
  module.exports = router;
  