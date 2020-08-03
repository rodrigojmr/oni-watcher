'use strict';

const { Router } = require('express');
const searchRouter = new Router();
const axios = require('axios');
const { res } = require('../app');

axios.defaults.headers.common['Accept'] = 'application/vnd.api+json';
axios.defaults.headers.common['Content-Type'] = 'application/vnd.api+json';

searchRouter.post('/', async (req, res, next) => {
  const { name } = req.body;
  const url = `https://kitsu.io/api/edge/anime?canonicalTitle=${name}`;

  try {
    const result = await axios.get(url);
    const anime = result.data.data;
    console.log('result.data.data: ', result.data.data);
    res.render('index', { anime: anime });
  } catch (error) {
    next(error);
  }
});

module.exports = searchRouter;
