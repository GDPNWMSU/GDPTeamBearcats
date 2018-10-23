var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
const http = require('http')
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
let mail = require('./mail');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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


// Reset Password
app.get("/forgotpswd", function(req, res){
  res.render('forgot_password', {title:'Forgot password','message' : req.flash('message')});
});

app.get("/resetpswd/:token", function(req, res) {
connection.query("select * from tbl_users where resettoken = ?", [req.params.token], function(err, rows){
  if(rows.length>0){
    console.log("rows", rows[0].username);
    res.render("reset_password", {title:'Reset password','message' : req.flash('message'), token: req.params.token});
  }
  else{
    res.render("404", {title:'Page not found'});
  }
  
});
});


app.post("/resetpswd",function(req, res){
    let pwd = req.body.password;
    let confpwd = req.body.confirm_password;
    let token = req.body.token;
    if(pwd === confpwd){
      cryptoPwd = crypto.createHash('sha1').update(''+pwd).digest('hex');
      connection.query("update tbl_users SET password = ? , resettoken = ? where resettoken = ?", [cryptoPwd, "", token] , function(err, rows){
        console.log(err,rows);
        if(!err){
            res.render("login", {title:'login','message' : "Password reset successfully" })      
        }
    });
      
    }else{
      res.render("reset_password", {title:'Reset Password','message' : "Passsword mismatch" });
    }

});


app.post("/forgotpswd", function(req, res){
    let username = req.body.username;
    connection.query("select * from tbl_users where email = ?", [username], function(err, rows){
      console.log(err);
      if(rows.length>0){
        console.log("rows", rows[0].username);
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          connection.query("update tbl_users SET resettoken = ? where email = ?", [token, username] , function(err, rows){
              console.log(err,rows);
              if(!err){
                  mail("Forgot Password Link", username, "http://localhost:8081/resetpswd/"+ token);
              }
          });
        });

        res.render('forgot_password', {title:'Forgot Password','message' : 'Reset Password link sent to your mail'});
      }
      else{
        res.render('forgot_password', {title:'Forgot Password','message' : 'Invalid Username'});
      }
    });
});


//All routes
app.use('/', routes);

// Listen for an application request on port 8081
server.listen(8081, function () {
  console.log("Server started and currently in /app.js")
  console.log('GDP-Node app listening on http://127.0.0.1:8081/');
});