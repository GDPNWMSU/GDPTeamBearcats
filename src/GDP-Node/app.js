var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
const http = require('http')
const engines = require('consolidate')
const expressLayouts = require('express-ejs-layouts')

//Authentication Packages
var session = require('session');
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore =require('express-mysql-session');
 
var index = require('./routes/index');
var users = require('./routes/users');


var app = express();  // make express app
// var router = express.Router();
// var path = __dirname + '/views/';
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
  }))
  app.use(expressLayouts)
var server = require('http').createServer(app); // inject app into the server
// set up the view engine
// manage our entries
// set up the logger
// set up routes
  var routes = require('./routes/index.js');
// load routing

  app.use('/', routes);

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    function(email, password, done) { 
      console.log(email);
      console.log(password);
      const db = require('./db');
      db.query('SELECT id, password from users WHERE email = ?',[email], function(err,results,fields){
        if(err){done(err)};
        if(results.length ==0){
          done(null,false);
        }
        //console.log(results[0].password.toString());
        const hash = results[0].password.toString();
        bcrypt.compare(password,hash, function(err,response){
          if(response == true){
            return done(null, {id: 1});
          }
          else{
            return done(null,false);
          }
        });
      
      })
    }
  ));
  
// POSTS
// 404
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/views/404.html');
});
//Set default engine
// set the root view folder
app.set('views', path.join(__dirname, 'views'));

// specify desired view engine
app.set('view engine', 'ejs')
app.engine('ejs', engines.ejs)
// Listen for an application request on port 8081
server.listen(8080, function () {
    console.log('GDP-Node app listening on http://127.0.0.1:8080/');
});