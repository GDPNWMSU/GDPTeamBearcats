const express = require('express');
const app = express.Router()
const XLSX = require('xlsx');
const formidable = require('formidable');
console.log('Inside routes/index')
// app.use('/',require('../controllers/home.js'))

app.use('/login',require('../controllers/login.js'))
app.use(require('../controllers/reset_password.js'))
app.use(require('../controllers/forgot_password.js'))
app.use('/profile',isAuthenticated,require('../controllers/profile.js'))
app.use('/import',isAuthenticated, require('../controllers/data_import.js'))
app.use('/clearDB',isAuthenticated,require('../controllers/database_clear.js'))
app.use('/view',isAuthenticated, require('../controllers/data_export.js'))
app.use('/export',isAuthenticated,require('../controllers/report_export.js'))
app.use('/report',isAuthenticated,require('../controllers/report_export.js'))
app.use('/manage',isAuthenticated,require('../controllers/manage.js'))
app.use('/add_users',isAuthenticated,require('../controllers/add_users.js'))
app.use('/edit_users',isAuthenticated,require('../controllers/edit_user.js'))

app.get('/', isAuthenticated, function(req, res, next) { 
    var username   = req.session.user.email;
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