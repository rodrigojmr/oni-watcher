'use strict';

const { Router } = require('express');
const searchRouter = new Router();
const Kitsu = require('kitsu');

const api = new Kitsu();

const setSeason = month => {
  switch (month) {
    case 1:
    case 2:
    case 3:
      return 'Winter';
    case 4:
    case 5:
    case 6:
      return 'Spring';
    case 7:
    case 8:
    case 9:
      return 'Summer';
    case 10:
    case 11:
    case 12:
      return 'Autumn';
  }
};

searchRouter.post('/', async (req, res, next) => {
  const { name } = req.body;

  try {
    const { data } = await api.get('anime', {
      filter: {
        text: name
      }
    });
    for (const anime of data) {
      const month = parseInt(anime.startDate.split('-')[1]);

      anime.year = anime.startDate.split('-')[0];
      anime.season = setSeason(month);
    }
    // console.log(data);
    res.render('index', { anime: data });
  } catch (error) {
    next(error);
  }
});

module.exports = searchRouter;
