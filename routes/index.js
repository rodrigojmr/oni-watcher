'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  // try {
  //   const { data } = await api.get('anime');

  //   console.log(data[0]);
  //   for (const anime of data) {
  //     const month = parseInt(anime.startDate.split('-')[1]);
  //     anime.year = anime.startDate.split('-')[0];
  //     anime.season = setSeason(month);
  //   }
  //   res.render('search', { anime: data });
  // } catch (error) {
  //   next(error);
  // }
  res.render('index', { title: 'Oni-Watch' });
});

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
