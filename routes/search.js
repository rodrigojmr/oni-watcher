'use strict';

const { Router } = require('express');
const searchRouter = new Router();
const Kitsu = require('kitsu');
const api = new Kitsu();
const setSeason = require('./../middleware/setSeason');

searchRouter.post('/', async (req, res, next) => {
  const { name } = req.body;

  try {
    const { data } = await api.get('anime', {
      filter: {
        text: name
      },
      include: 'genres'
    });

    console.log(data[0]);
    for (const anime of data) {
      const month = parseInt(anime.startDate.split('-')[1]);
      anime.year = anime.startDate.split('-')[0];
      anime.season = setSeason(month);
    }
    res.render('search', { anime: data });
  } catch (error) {
    next(error);
  }
});

searchRouter.get('/', (req, res, next) => {
  res.render('search', { title: 'This is now search page' });
});

module.exports = searchRouter;
