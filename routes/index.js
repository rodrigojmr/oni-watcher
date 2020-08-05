'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const User = require("../models/user");
const Post = require('./../models/post');
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});


const roleRouteGuard = require('./../middleware/role-route-guard');

router.get(
  '/User',
  routeGuard,
  roleRouteGuard(['User', 'Moderator']),
  (req, res, next) => {
    res.render('User');
  }
);


router.post("/:username/follow", (req, res) => {
  //Looks up the user to follow.
  User.findOne({ username: req.params.username }).exec((err, follow) => {
    if (err) {
      res.redirect("/" + req.params.username);
      return;
    }

    //Looks up you.
    User.findOne({ username: req.user.username }).exec((err, currentUser) => {
      //Determines if you're following that user.
      const followingIndex = currentUser.following.indexOf(follow._id);

      //This route does double duty - follows if you're not following, unfollows if you are.
      if (followingIndex > -1) {
        currentUser.following.splice(followingIndex, 1);
      } else {
        currentUser.following.push(follow._id);
      }

      //Saves the follow list change.
      currentUser.save(err => {
        req.session.user = currentUser;
        //res.back is an npm package which makes it trivial to jump back to the previous page.
        return res.back();
      });
    });
  });
});

//Shows everyone you're following.
router.get("/following", (req, res, next) => {
  if (!req.user) {
    res.redirect("/login");
  }

  const username = req.user.username;

  //The following lookup. Also pretty straightforward.
  User.find({ _id: { $in: req.user.following } }).exec((err, users) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    User.aggregate([{ $sample: { size: 2 } }]).exec((err, randomUsers) => {
      User.find({}).exec((err, allUsers) => {
        res.render("profile/display", {
          username: username,
          users: users,
          session: req.user,
          buttonText: "Unfollow",
          randomUsers,
          allUsers: allUsers
        });
      });
    });
  });
});



router.get('/:username/following', (req, res, next) => {
 const username = undefined;

  if (req.user) {
   const username = req.user.username;
  }

  User.findOne({ username: req.params.username }).exec((err, foundUser) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    User.find({ _id: { $in: foundUser.following } }).exec((err, users) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      User.aggregate([{ $sample: { size: 2 } }]).exec((err, randomUsers) => {
        User.find({}).exec((err, allUsers) => {
          res.render("profile/display", {
            username: username,
            users: users,
            session: req.user,
            buttonText: "Unfollow",
            randomUsers,
            allUsers: allUsers
          });
        });
      });
    });
  })
})


//Looks up everyone who follows you. Kind of backwards of following - we look in following in req.user_id
router.get("/followers", (req, res, next) => {
  if (!req.user) {
    res.redirect("/login");
  }

  const username = req.user.username;

  User.find({ following: { $in: [req.user._id] } }).exec((err, users) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    User.aggregate([{ $sample: { size: 2 } }]).exec((err, randomUsers) => {
      User.find({}).exec((err, allUsers) => {
        res.render("profile/display", {
          username: username,
          users: users,
          session: req.user,
          buttonText: "Unfollow",
          randomUsers,
          allUsers: allUsers
        });
      });
    });
  });
});

//Same thing as /followers with another user.
router.get('/:username/followers', (req, res, next) => {
  const username = undefined;

  if (req.user) {
   const username = req.user.username;
  }

  User.findOne({ username: req.params.username }).exec((err, foundUser) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    User.find({ following: { $in: [foundUser._id] } }).exec((err, users) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      User.aggregate([{ $sample: { size: 2 } }]).exec((err, randomUsers) => {
        User.find({}).exec((err, allUsers) => {
          res.render("profile/display", {
            username: username,
            users: users,
            session: req.user,
            buttonText: "Unfollow",
            randomUsers,
            allUsers: allUsers
          });
        });
      });
    });
  })
})




module.exports = router;
