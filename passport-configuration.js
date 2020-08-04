'use strict';

const { Router } = require('express');
const router = new Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');

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
  transport.sendMail ({
    from: 'Anime Site" <process.env.NODEMAILER_EMAIL>', 
    to: `${user.email}`, 
    subject: 'Confirmation email', 
    html: `<b>Hello!</b>
    please confirm your email clicking <a href="http://localhost:3000/confirm-email/${user.confirmationToken}">here</a>` 
  })
  .then(result => {
    console.log('Email was sent.');
    console.log(result);
})
.catch(error => {
    console.log('There was an error sending email');
    console.log(error);
});
}

router.get('/confirm-email/:mailToken', (req, res, next) => {
  const mailToken = req.params.passport.mailToken;
  User.findOneAndUpdate({ confirmationToken: mailToken }, { status: 'Active' })
    .then(user => {
      req.session.user = user._id;
      res.redirect('/success');
    })
    .catch(err => next(err));
});



passport.use(
  'local-sign-up',
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, callback) => {
      const name = req.body.name;
      const role = req.body.role;
      const confirmToken = generateId(10);

      bcryptjs
        .hash(password, 10)
        .then(hash => {
          return User.create({
            name,
            email,
            role,
            passwordHash: hash,
            confirmationToken: confirmToken
          });
        })
        .then(user => {
          sendMail(user);
          if (user) 
          callback(null, user);
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
