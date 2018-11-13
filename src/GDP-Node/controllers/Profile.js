var express = require('express')
var mysql = require("mysql");
var logger = require('morgan')
var engines = require('consolidate')
var connection = require('../config/db_connection');
var bodyParser = require('body-parser');
const router = express.Router();
const crypto = require('crypto');


let message = ''
router.get('/', (req, res, next) => {
    res.render('profile.ejs', {
        title: 'profile',
        message: message,
        username: req.session.user.email,
        firstName: req.session.user.firstName,
        user: req.session.user
    })
})
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/add_profile', function (request, response) {
    console.log(request.body);
    let cryptoPwd = crypto.createHash('sha1').update('' + request.body.password).digest('hex');
    connection.query("update tbl_users SET email=?,password=?, firstName=?, lastName=? where id=?", [request.body.email, cryptoPwd, request.body.first_name, request.body.last_name, request.session.user.id], function (err, result) {
        if (err) {
            message = false
            response.redirect('/profile/')
            throw err;
        }

        console.log("1 record inserted");
        message = true
        request.session.user.firstName = request.body.first_name;
        request.session.user.lastName = request.body.last_name;
        response.redirect('/profile/')
    });

});

module.exports = router