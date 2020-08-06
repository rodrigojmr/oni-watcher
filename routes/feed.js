

'use strict';

const express = require('express');
const User = require('../models/user_model');
const routeGuard = require('./../middleware/route-guard');


const router = new express.Router();

router.get('/feed', routeGuard, (req, res, next) => {
    let moderator = req.user.role === 'Moderator';
    User.find()
    .then(users => {
        const data = {users, moderator}
        res.render('feed', data);
    })
})

  router.get('/deleteProfile/:id', (req, res, next) => {
    const {id} = req.params;
    User.findByIdAndDelete(id)
      .then( user => {
        res.redirect('/');
      }) 
      .catch(err => res.send(err));
  })
  
  module.exports = router;

  