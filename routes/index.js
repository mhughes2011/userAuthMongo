var express = require('express');
var router = express.Router();
var User = require('../models/user');

//Get /login
router.get('/login', (req, res, next) => {
  res.render('login', {title: 'Log In'});
})

router.post('/login', (req, res, next) =>{
  res.send('Logged In!');
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
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
