'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user_model');
const bcryptjs = require('bcryptjs');
const { Router } = require('express');
const router = new Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const fileUploader = require('./cloudinary-configuration');
const routeGuard = require('./middleware/route-guard');

//const fileUploader = require('../cloudinary-configuration');




const generateId = length => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};


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

router.get('/confirmed', routeGuard, (req, res, next) => {
  res.render('confirmed');
  console.log(req.user);
});

router.get(`/confirmed/:token`, (req, res, next) => {
const token = req.params.token;
User.findOneAndUpdate({ confirmationCode: token }, { status: 'Active' })
.then(user =>  {
  if (!user) {
    return Promise.reject(
      new Error('Confirmation successful.')
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




passport.use(
  'local-sign-up',
  fileUploader.single('avatar'),
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, callback) => {
      const username = req.body.username;
      const role = req.body.role;
      const avatar = req.body.avatar;
      const confirmToken = generateId(20);
      bcryptjs
        .hash(password, 10)
        .then(hash => {
          return User.create({
            username,
            email,
            role,
            avatar,
            passwordHash: hash,
            confirmationCode: confirmToken
          });
        })
        .then(user => {
          sendMail(user);
          req.session.user = user._id;
          if (user) callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);

passport.use(
  'local-sign-in',
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
    let user;
    User.findOne({
      email
    })
      .then(document => {
        if (!document) {
          return Promise.reject(new Error("There's no user with that email."));
        } else {
          user = document;
          return bcryptjs.compare(password, user.passwordHash);
        }
      })
      .then(result => {
        if (result) {
          callback(null, user);
        } else {
          return Promise.reject(new Error('Wrong password.'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

module.exports = router;
