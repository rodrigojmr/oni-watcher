'use strict';

const { Router } = require('express');
const animeRouter = new Router();
const routeGuard = require('./../middleware/route-guard');
const setSeason = require('./../middleware/setSeason');

const User = require('../models/user_model');
const LibEntry = require('../models/library');
const Anime = require('../models/anime');

const Kitsu = require('kitsu');
const api = new Kitsu();

animeRouter.get('/:slug', async (req, res, next) => {
  const slug = req.params.slug;

  try {
    const animeResult = await api.get('anime', {
      filter: {
        slug: slug
      },
      include: 'genres,categories,quotes,episodes'
    });
    const anime = animeResult.data[0];

    const entry = await Anime.findOne({ slug });
    let libEntry;
    if (entry) {
      const id = entry._id;
      libEntry = await LibEntry.findOne({
        anime: id,
        user: req.user
      });
    }
    // libEntry.status = libEntry.status.map)
    const month = parseInt(anime.startDate.split('-')[1]);
    anime.year = anime.startDate.split('-')[0];
    anime.season = setSeason(month);
    const data = { anime, libEntry };
    res.render('anime/display', { data });
  } catch (error) {
    next(error);
  }
});

module.exports = animeRouter;
