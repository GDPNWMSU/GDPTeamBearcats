var express = require('express')
var mysql = require("mysql");
var logger = require('morgan')
var engines = require('consolidate')
var connection = require('../config/db_connection');
var bodyParser = require('body-parser');
const router = express.Router()
var crypto = require('crypto');
let mail = require('../mail');

router.get('/', (req, res, next) => {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    res.render('add_users.ejs', {
        title: 'Add Users',
        message: '',
        username: username,
        firstName: firstName

    })
})
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/checkUser', function (req, res) {
    var sql = "SELECT email FROM tbl_users WHERE email='" + req.body.email.toLowerCase() + "'"
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
            res.redirect('404')
        }
        // connection.release()
        console.log(sql + "---" + rows.length + "req:" + req.body.email)
        if (rows.length > 0) {
            res.status(200).json({ 'doesUserExist': true })
        } else {
            res.status(200).json({ 'doesUserExist': false })
        }
    })
})

router.post('/add_user', function (req, res) {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    console.log(req.body);
    var sql = "INSERT INTO `tbl_users`(`email`, `password`, `firstName`, `lastName`) VALUES ('"+req.body.email+"','','";
    sql+= req.body.firstname+"','"+req.body.lastname+"')";
    console.log(sql)
    connection.query(sql, function (err, result) {
        if (err) {
            message = false
            res.redirect('/add_users/')
            throw err;
        }
        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            connection.query("update tbl_users SET resettoken = ? where email = ?", [token, req.body.email] , function(err, rows){
                console.log(err,rows);
                if(!err){
                    mail("Account created link", req.body.email, "http://localhost:8081/resetpswd/"+ token);
                }
        });
    });
        console.log("1 record inserted");
        message = true
        res.redirect('/add_users/')
    });

});




module.exports = router