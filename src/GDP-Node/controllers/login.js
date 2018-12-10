var mysql = require("mysql");
const express = require('express')
var flash = require('connect-flash');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('../config/db_connection').usersConnection;
var sess = require('express-session');
var Store = require('express-session').Store;
var BetterMemoryStore = require('../memory');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const router = express.Router()

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, //passback entire req to call back
    
}, function callback(req, username, password, done) {
    console.log(username+" "+password)
    if (!username || !password) { return done(true, false, req.flash('message', 'All fields are required.')); }
    var salt = '+DT=$Uk)6Q64Y*"$=J)$!Hwzg$(w"JuuQ}FrcGN^.s]KmX53x&^?tB$s>b"V#A';
    // var salt=''
    connection.query("select * from tbl_users where email = ?", [username], function (err, rows) {
        if (err) return done(403, false, req.flash('message', 'Invalid username or password.'));
        if (!rows.length) { return done(true, false, req.flash('message', 'Invalid username or password.')); }
        salt = salt + '' + password;
        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        var dbPassword = rows[0].password;
        if (!(dbPassword == encPassword)) {
            return done(null, false, req.flash('message', 'Invalid username or password.'));
        }
        console.log(username + ' -- Logged in');
        rows[0].password=null;
        rows[0].resettoken = null;
        req.session.user = rows[0];
        if(req.body.remember=="rememberMe"){
            req.session.cookie.expires=false
        }else{
            req.session.cookie.maxAge = 1000* 60 * 60;
        }
        return done(null, rows[0]);
    });
}
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    connection.query("select * from tbl_users where id = " + id, function (err, rows) {
        done(err, rows[0]);
    });

});

router.get('/', function (req, res) {
    res.render('login', { title: 'Login', 'message': req.flash('message') });
});

router.post("/", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: "Failed"
}), function (req, res, info) {
    // res.error('Unauthorized');
    res.render('login', {title: 'Login', 'message': req.flash('message') });
});

module.exports = router