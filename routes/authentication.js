'use strict';

const { Router } = require('express');
const router = new Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');






router.get('/sign-up', (req, res) =>
  res.render('sign-up', { title: 'Register here' })
);


router.post('/sign-up',  passport.authenticate('local-sign-up', {
    successRedirect: '/', 
    failureRedirect: '/sign-up'})
);


router.get('/sign-in', (req, res) =>
  res.render('sign-in', { title: 'Log in here' })
);

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/',
    failureRedirect: '/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  req.session.destroy(err => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
