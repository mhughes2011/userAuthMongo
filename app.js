var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); //Needs to be placed after session import
var app = express();

//mongodb connection
mongoose.connect('mongodb://localhost:27017/bookworm', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
//mongo error handler.  this will handle any errors that happen when connecting to the database
db.on('error', console.error.bind(console, 'connection error:'));

//use sessions for tracking logins
//Because of the MongoStore, these need to be moved to below the instantiation of the db on line 11.  This means the app stores session information in Mongo instead of in RAM
app.use(session({
  secret: 'treehouse loves you', //only required parameter
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

//make userID available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
})

// parse incoming requests
app.use(express.json());

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
//Tells the app where to find the pug views to display
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
