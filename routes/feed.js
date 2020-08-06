

'use strict';

const express = require('express');
const User = require('../models/user_model');
const routeGuard = require('./../middleware/route-guard');


const router = new express.Router();

router.get('/feed', routeGuard, (req, res, next) => {
    const id = req.user._id;
    let moderator = req.user.role === 'Moderator';
    User.find()
    .then(user => {
        user.id = id;
        const data = {user, moderator}
        res.render('feed', data);
    })
})

  router.get('/deleteProfile/:username', (req, res, next) => {
    const {id} = req.params;
    User.findByIdAndDelete(id)
      .then( user => {
        res.redirect('/views/feed');
      }) 
      .catch(err => res.send(err));
  })
  
  module.exports = router;

  