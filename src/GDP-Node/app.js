var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
const http = require('http')
require('dotenv').config();
const engines = require('consolidate')
const expressLayouts = require('express-ejs-layouts')
var app = express();  // make express app
var flash = require('connect-flash');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('./config/db_connection');
var sess = require('express-session');
var Store = require('express-session').Store;
var BetterMemoryStore = require(__dirname + '/memory');
let mail = require('./config/mail');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// dotenv.load({ path: '.env' })
// const result = dotenv.config()
//  console.log(result)
// if (result.error) {
//   throw result.error
// }
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 31557600000
}))
app.use(expressLayouts)
var server = require('http').createServer(app); // inject app into the server
// set up routes
var routes = require('./routes/index.js');
// app.post('/add_user',add_user);
//Set default engine
app.set('view engine', 'ejs')
// set the root view folder
app.set('views', path.join(__dirname, 'views'));

// specify desired view engine
app.engine('ejs', engines.ejs)

var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
app.use(sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store: store,
  resave: true,
  saveUninitialized: true

}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



//All routes
app.use('/', routes);

// Listen for an application request on port 8081
server.listen(8081, function () {
  console.log("Server started and currently in /app.js")
  console.log('GDP-Node app listening on http://127.0.0.1:8081/');
});