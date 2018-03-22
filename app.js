var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var favicon = require('serve-favicon')
var path = require('path')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var passport = require('passport');
var cors = require('cors');

require("dotenv").config();

//Import Passport Strategy and Other Functions
require('./configs/passport-config')

mongoose.connect(process.env.MONGODB_URI);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport session
app.use(session({
  secret: "secret",
  resave: true, 
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200']
  })
);

// ============ routes ==========
var index = require('./routes/index');
app.use('/', index);

var authRoutes = require("./routes/auth-routes");
app.use("/", authRoutes);

var visitRoutes = require("./routes/visit-routes");
app.use("/", visitRoutes);

var userRoutes = require("./routes/user-routes");
app.use("/", userRoutes);

//================================

app.use((req, res, next) => {
  // If no routes match, send them Angular HTML
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
