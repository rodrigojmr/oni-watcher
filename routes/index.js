'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

/*
router.get('/confirmed', (req, res, next) => {
  res.render('confirmed');
  console.log(req.user);
});
*/

const roleRouteGuard = require('./../middleware/role-route-guard');

router.get(
  '/User',
  routeGuard,
  roleRouteGuard(['User', 'Moderator']),
  (req, res, next) => {
    res.render('User');
  }
);

module.exports = router;
