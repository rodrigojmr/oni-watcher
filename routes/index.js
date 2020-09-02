'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const axios = require('axios');
const Kitsu = require('kitsu');
const api = new Kitsu({ pluralize: false });

router.get('/', async (req, res, next) => {
  try {
    const trending = await api.get('trending/anime', {
      page: { limit: 6 }
    });
    const sixTrending = trending.data.filter((e, i) => i <= 5);

    // const topRated = await api.get('anime', {
    //   page: { limit: 6 },
    //   sort: 'ratingRank'

    // });

    const current = await api.get('anime', {
      page: { limit: 6 },
      filter: {
        status: 'current'
      },
      sort: '-averageRating'
    });

    const data = {
      title: 'Oni-Watchers',
      trending: sixTrending,
      current: current.data
    };

    res.render('index', data);
  } catch (error) {
    console.log(error);
  }
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
