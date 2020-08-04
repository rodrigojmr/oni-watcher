'use strict';

const express = require('express');
const User = require('./../models/user');

const routeGuard = require('./../middleware/route-guard');

const profileRouter = new express.Router();

profileRouter.get('/edit', routeGuard, (request, response, next) => {
  response.render('profile/edit');
});

profileRouter.post('/edit', routeGuard, (request, response, next) => {
  const id = request.session.userId;
  const { name, email } = request.body;

  User.findByIdAndUpdate(id, { name, email })
    .then(() => {
      response.redirect('/profile');
    })
    .catch(error => {
      next(error);
      
    });
});

profileRouter.get('/:id', routeGuard, (req, res) => {
    res.render('profile/display');
  });

module.exports = profileRouter;
