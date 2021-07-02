var express = require('express');
var router = express.Router();
var User = require('../models/user');

/**
 * APP IS BROKEN!!!
 * For some reason the mongo db isn't working because the data from the form isn't actually being received by the body.  Whenever you submit to register or login there is no information coming from the form.  This breaks the entire app.  I think it has something to do with the schema implementation from Mongoose but I have no idea.
 */

//GET /profile
router.get('/profile', (req, res, next) => {
  if(!req.session.userId) {
    var err = new Error('You are not authorized to view this page.');
    err.status = 403;
    next(err);
  }
  User.findById(req.session.userId)
    .exec((error, user) => {
      if(error) {
        next(error);
      }else {
        res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook});
      }
    })
})

//GET /logout
router.get('/logout', (req, res, next) => {
  if(req.session) {
    //delete session object
    req.session.destroy((err) => {
      if(err) {
        next(err);
      }else {
        res.redirect('/');
      }
    })
  }
})

//GET /login
router.get('/login', (req, res, next) => {
  res.render('login', {title: 'Log In'});
})

//POST /login
router.post('/login', (req, res, next) =>{
  console.log(req.body);
  if(req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if(error || !user) {
        var err = new Error('Wrong email or password');
        err.status = 401;
        next(err);
      } else {
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required');
    err.status = 400;
    next(err);
  }
})

// GET /
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Home' });
})

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
})

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
})

// GET /register
router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Sign up'});
})

// POST /register
router.post('/register', (req, res, next) => {
  console.log(req.body.password, req.body.confirmPassword);
  if(
    req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword
    ) {

      //confirm that user typed same password twice
      if(req.body.password !== req.body.confirmPassword) {
        const err = new Error('Passwords must match.');
        err.status = 400;
        next(err);
      } 

      //create object with form input
      const userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      };

      //use schema's 'create' method to insert document into Mongo
      User.create(userData, (error, user) => {
        if(error) {
          next(error);
        } else {
          req.session.userId = user._id;
          res.redirect('/profile');
        }
      });

    } else {
      const err = new Error('All fields required.');
      err.status = 400;
      next(err);
    }
})

module.exports = router;
