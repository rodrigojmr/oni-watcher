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
    console.log(data);
    res.render('index', { anime: data });
  } catch (error) {
    next(error);
  }
});

module.exports = searchRouter;
