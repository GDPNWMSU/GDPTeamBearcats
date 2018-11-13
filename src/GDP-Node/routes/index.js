const express = require('express');
const app = express.Router()
const XLSX = require('xlsx');
const formidable = require('formidable');
console.log('Inside routes/index')
// app.use('/',require('../controllers/home.js'))

app.use('/login', require('../controllers/login.js'))
app.use(require('../controllers/reset_password.js'))
app.use(require('../controllers/forgot_password.js'))
app.use('/profile', isAuthenticated, require('../controllers/profile.js'))
app.use('/updatepswd', isAuthenticated, require('../controllers/profile_password.js'))
app.use('/import', isAuthenticated,isAdmin, require('../controllers/data_import.js'))
app.use('/clearDB', isAuthenticated,isAdmin, require('../controllers/database_clear.js'))
app.use('/view', isAuthenticated,isAdmin, require('../controllers/data_export.js'))
app.use('/export', isAuthenticated,isAdmin, require('../controllers/report_export.js'))
app.use('/report', isAuthenticated, require('../controllers/report_export.js'))
app.use('/manage', isAuthenticated,isAdmin, require('../controllers/manage.js'))

app.get('/logout', function (req, res) {
    req.session.destroy();
    req.logout();
    res.redirect('/login');
});

app.get('/', isAuthenticated, function (req, res, next) {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    var lastName  = req.session.user.lastName;
    var role = req.session.user.role;
    res.render('home', { title: 'Home', username: username, firstName: firstName, role: role , lastName: lastName});
})

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
function isAdmin(req, res, next) {
    if (req.session.user.role=="admin")
        return next();
    res.redirect('/404');
}
app.get('/500', function (req, res) {
    if (req.session.user) {
        var username = req.session.user.email != undefined ? req.session.user.email : null;
        var firstName = req.session.user.firstName != undefined ? req.session.user.firstName : null;
        res.render('500', {
            title: 'Internal error occured',
            username: username,
            firstName: firstName
        });
    } else {
        res.render('500', {
            title: 'Internal error occured'
        });
    }
});
app.get('*', function (req, res) {
    res.render('404', { title: 'Page not found' });
});

module.exports = app