'use strict';

const { Router } = require('express');
const router = new Router();

const passport = require('passport');

router.get('/sign-up', (req, res) =>
  res.render('sign-up', { title: 'Register here' })
);

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/profile',
    failureRedirect: '/sign-up'
  })
);

router.get('/sign-in', (req, res) =>
  res.render('sign-in', { title: 'Log in here' })
);

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/profile',
    failureRedirect: '/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
