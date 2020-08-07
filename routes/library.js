'use strict';

const { Router } = require('express');
const libraryRouter = new Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('../models/user_model');
const LibEntry = require('../models/library');
const Anime = require('../models/anime');

const Kitsu = require('kitsu');
const api = new Kitsu();

libraryRouter.post('/anime/:slug/update', async (req, res, next) => {
  const slug = req.params.slug;

  const { status, progress, rating } = req.body;

  try {
    const { data } = await api.get('anime', {
      filter: {
        slug: slug
      }
    });

    const anime = data[0];

    console.log(anime);

    let animeEntry = await Anime.findOne({ slug });
    console.log('animeEntry: ', animeEntry);

    if (!animeEntry) {
      animeEntry = await Anime.create({
        name: anime.canonicalTitle,
        poster: anime.posterImage.small,
        type: anime.showType,
        length: anime.episodeLength,
        slug: anime.slug
      });
    }

    const libraryEntry = await LibEntry.create({
      user: req.session.passport.user,
      anime: animeEntry._id,
      status,
      progress,
      rating
    });

    (await animeEntry).save();
    (await libraryEntry).save();

    res.redirect(`/anime/${(await animeEntry).slug}`);
  } catch (error) {
    next(error);
  }
});

libraryRouter.post('/anime/:slug/favorite', async (req, res, next) => {
  const slug = req.params.slug;

  try {
    const user = await User.findById(req.session.passport.user);
    const animeEntry = await Anime.findOne({ slug });

    let isFavorited = user.favorites.includes(animeEntry._id);

    if (!isFavorited) {
      user.favorites.push(animeEntry._id);
      isFavorited = true;
      user.save();
    } else {
      const index = user.favorites.indexOf(animeEntry._id);
      user.favorites.splice(index, 1);
      isFavorited = false;
      user.save();
    }

    res.redirect;
    res.redirect(`/anime/${animeEntry.slug}`);
  } catch (error) {
    next(error);
  }
});

module.exports = libraryRouter;
