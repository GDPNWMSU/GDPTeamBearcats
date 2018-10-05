var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
const http = require('http')
const engines = require('consolidate')
const expressLayouts = require('express-ejs-layouts')
var app = express();  // make express app
// var router = express.Router();
// var path = __dirname + '/views/';
//var passport = require("passport")

var flash             = require('connect-flash');
var crypto            = require('crypto');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var connection        = require('./config/db_connection');
var sess              = require('express-session');
var Store             = require('express-session').Store;
var BetterMemoryStore = require(__dirname + '/memory');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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



  //Set default engine
// set the root view folder
app.set('views', path.join(__dirname, 'views'));

// specify desired view engine
app.set('view engine', 'ejs')
app.engine('ejs', engines.ejs)

  var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
   app.use(sess({
      name: 'JSESSION',
      secret: 'MYSECRETISVERYSECRET',
      store:  store,
      resave: true,
      saveUninitialized: true
  
  }));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, //passback entire req to call back
  } , function callback(req, username, password, done){
        console.log(username+' = '+ password);
        if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }
        var salt = '';
       // connection.query("INSERT INTO `tbl_users`(`username`, `password`, `First Name`, `Last Name`) VALUES ('hiah','haha','haha','jka')");
        connection.query("select * from tbl_users where username = ?", [username], function(err, rows){
            console.log(err);

          if (err)   return done(null, false, req.flash('message','Invalid username or password.'));
            // console.log("-----?????---------"+rows[0].username);  
          if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
          salt = salt+''+password;
          var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
          var dbPassword  = rows[0].password;
          console.log("-------ency----",encPassword)
          console.log("=======decry=====",dbPassword)
          if(!(dbPassword == encPassword)){
              return done(null, false, req.flash('message','Invalid username or password.'));
           }
  
           req.session.user = rows[0];
          return done(null, rows[0]);
        });
      }
  ));
  

    passport.serializeUser(function(user, done){
          done(null, user.id);
      });
      passport.deserializeUser(function(id, done){
          connection.query("select * from tbl_users where id = "+ id, function (err, rows){
              done(err, rows[0]);
          });
      
      });

      app.get('/login', function(req, res){
          res.render('login',{title:'Login','message' :req.flash('message')});
        });
      
        // app.post("/login",(req,res)=>{  let body = '';
        // req.on('data', chunk => {
        //     body += chunk.toString(); // convert Buffer to string
        // });
        // req.on('end', () => {
        //     console.log(body);
        // });}, passport.authenticate('local', {
        app.post("/login", passport.authenticate('local', {
          successRedirect: '/',
              failureRedirect: '/login',          
              failureFlash: "Failed"
          }), function(req, res, info){
              res.render('login',{title:'Login','message' :req.flash('message')});
        });

// POSTS

//All routes
app.use('/', routes);
// 404
// app.get('*', function (req, res) {
//     res.sendFile(__dirname + '/views/404.ejs');
// });

// Listen for an application request on port 8081
server.listen(8081, function () {
    console.log("Server started and currently in /app.js")
    console.log('GDP-Node app listening on http://127.0.0.1:8081/');
});