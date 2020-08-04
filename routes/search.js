'use strict';

const { Router } = require('express');
const searchRouter = new Router();
const Kitsu = require('kitsu');

const api = new Kitsu();

searchRouter.post('/', async (req, res, next) => {
  const { name } = req.body;

  try {
    const { data } = await api.get('anime', {
      filter: {
        text: name
      }
    });
    for (const anime of data) {
      anime.year = anime.startDate.split('-')[0];

      const month = parseInt(anime.startDate.split('-')[1]);
      let season = '';
      switch (month) {
        case 1:
        case 2:
        case 3:
          season = 'Winter';
          break;
        case 4:
        case 5:
        case 6:
          season = 'Spring';
          break;
        case 7:
        case 8:
        case 9:
          season = 'Summer';
          break;
        case 10:
        case 11:
        case 12:
          season = 'Autumn';
          break;
      }
      anime.season = season;
    }
    // console.log(data);
    res.render('index', { anime: data });
  } catch (error) {
    next(error);
  }
});

module.exports = searchRouter;
