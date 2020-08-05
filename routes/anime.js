'use strict';

const { Router } = require('express');
const animeRouter = new Router();
const routeGuard = require('./../middleware/route-guard');
const setSeason = require('./../middleware/setSeason');

const User = require('../models/user');
const LibEntry = require('../models/library');
const Anime = require('../models/anime');

const Kitsu = require('kitsu');
const api = new Kitsu();

animeRouter.get('/:slug', async (req, res, next) => {
  const slug = req.params.slug;

  try {
    const { data } = await api.get('anime', {
      filter: {
        slug: slug
      },
      include: 'genres,categories,quotes,episodes'
    });
    const anime = data[0];

    const month = parseInt(anime.startDate.split('-')[1]);
    anime.year = anime.startDate.split('-')[0];
    anime.season = setSeason(month);
    res.render('anime/display', { anime });
  } catch (error) {
    next(error);
  }
});

module.exports = animeRouter;
