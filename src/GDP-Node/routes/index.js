const express = require('express');
const app = express.Router()
const XLSX = require('xlsx');
const formidable = require('formidable');
console.log('Inside routes/index')
// app.use('/',require('../controllers/home.js'))
// router.use('/login',require('../controllers/login.js'))
app.use('/profile',isAuthenticated,require('../controllers/profile.js'))
app.use('/import',isAuthenticated, require('../controllers/data_import.js'))
app.use('/clearDB',isAuthenticated,require('../controllers/database_clear.js'))
app.use('/view',isAuthenticated, require('../controllers/data_export.js'))
app.use('/export',isAuthenticated,require('../controllers/report_export.js'))
app.use('/report',isAuthenticated,require('../controllers/report_export.js'))
app.use('/manage',isAuthenticated,require('../controllers/manage.js'))
app.use('/add_users',isAuthenticated,require('../controllers/add_users.js'))

app.get('/logout', function(req, res){
    req.session.destroy();
    req.logout();
    res.redirect('/login');
});

app.get('/', isAuthenticated, function(req, res, next) { 
    var username   = req.session.user.username;
    var firstName  = req.session.user.firstName;
    
    res.render('home', {title:'Home',username: username, firstName: firstName });
})

function isAuthenticated(req, res, next) {
    
      if (req.isAuthenticated())
    
        return next();
    
      res.redirect('/login');
    
}
app.get('*', function(req, res){
    res.render('404',{title:'Page not found'});
});





module.exports = app