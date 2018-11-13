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
    res.render('profile_password.ejs', {
        title: 'updatepassword',
        message: message,
    })
})
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/update_password', function (request, response) {
    console.log(request.body);
    let cryptoPwd = crypto.createHash('sha1').update('' + request.body.password).digest('hex');
    connection.query("update tbl_users SET password=? where id=?", [cryptoPwd, request.session.user.id], function (err, result) {
        if (err) {
            message = false
            response.redirect('/profile/')
            throw err;
        }

        console.log("1 record inserted");
        message = true
        response.redirect('/profile/')
    });

});

module.exports = router