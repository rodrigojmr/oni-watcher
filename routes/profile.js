'use strict';

const express = require('express');
const User = require('./../models/user');
const ObjectID = require('mongodb').ObjectID;


const routeGuard = require('./../middleware/route-guard');

const profileRouter = new express.Router();

profileRouter.get('/settings', routeGuard, (request, response, next) => {
  response.render('profile/settings');
});

profileRouter.post('/settings', routeGuard, (req, res, next) => {
  const { name, email } = req.body;
  const _id = ObjectID(req.session.passport.user);

  User.updateOne({ _id }, { $set: { name, email} }, (err) => {
    if (err) {
      throw err;
    }
    
    res.redirect('/profile/');
      
    });
});

profileRouter.get('/:id', routeGuard, (req, res) => {
    res.render('profile/display');
  });

module.exports = profileRouter;