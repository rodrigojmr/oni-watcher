'use strict';

const { Router } = require('express');
const router = new Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');


const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });
  
  function sendMail(user) {
    transport.sendMail({
      from: 'Anime Site" <process.env.NODEMAILER_EMAIL>',
      to: `${user.email}`,
      subject: 'Confirmation email',
      html: `<b>Hello!</b>
    please confirm your email clicking <a href = "http://localhost:3000/confirmed/${user.confirmationCode}">Click here</a>`
    })
    .then(result => {
      console.log('Email was sent');
      console.log(result);
    });
  }
  




  
  router.get('/confirmed', (req, res, next) => {
    res.render('confirmed');
    console.log(req.user);
  });
  
  router.get(`/confirmed/:token`, (req, res, next) => {
  const token = req.params.token;
  User.findOneAndUpdate({ confirmationCode: token }, { status: 'Active' })
  .then(user =>  {
    if (!user) {
      return Promise.reject(
        new Error('Confirmation unsuccessful. Please try again.')
      );
    } else {
      req.session.user = user._id;
      res.redirect(`confirmed`);
    }
  })
  .catch(error => {
    next(error);
  });
  });

  module.exports = router;
