const express = require('express')
const router = express.Router()
const connection = require('../config/db_connection').usersConnection;
var logger = require('morgan')
var bodyParser = require('body-parser');
var crypto = require('crypto');
let mail = require('../config/mail');

console.log("Inside controllers/manage.js")
router.get('/', (req, res, next) => {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    var sql = "SELECT `ROLES` FROM tbl_user_roles"
    connection.query(sql, function (err, roles) {
        if (err) {
            throw err;
            res.redirect('404')
        }
        console.log(sql + "---" + JSON.stringify(roles))
        if (roles.length >= 0) {
            res.render('manage', {
                title: 'Manage Users',
                message: '',
                username: username,
                firstName: firstName,
                roles: roles
            })
        } else {
            res.render('500', {
                title: 'Internal error',
                username: req.session.user.email,
                firstName: req.session.user.firstName,
            })
        }
    })

})
router.post('/checkUser', function (req, res) {
    // console.log(req.session.user.email + req.session.user.firstName);
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var sql = "SELECT email FROM tbl_users WHERE email='" + req.body.email.toLowerCase() + "'"
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
                res.redirect('404')
            }
            // connection.release()
            // console.log(sql + "---" + rows.length + "req:" + req.body.email)
            if (rows.length > 0) {
                res.status(200).json({ 'doesUserExist': true })
            } else {
                res.status(200).json({ 'doesUserExist': false })
            }
        })
    } else {
        res.status(404);
    }
})
router.post('/add_users', function (req, res) {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var salt = 'newAdd' + Date.now()
        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        var sql = "INSERT INTO `tbl_users`(`email`, `password`, `firstName`, `lastName`,`role`) VALUES ('" + req.body.email.toLowerCase() + "','" + encPassword + "','";
        sql += req.body.firstname + "','" + req.body.lastname + "','" + req.body.role + "')";
        // console.log(sql)
        connection.query(sql, function (err, result) {
            if (err) {
                message = false
                console.log(err);
                throw err;
            }
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                connection.query("update tbl_users SET resettoken = ? where email = ?", [token, req.body.email.toLowerCase()], function (err, rows) {
                    console.log(err, rows);
                    if (!err) {
                        console.log("1 user account created in database");
                        const email = require('../config/mail');
                        var subject = 'Pending account!'
                        var html = '<h2>Create new password</h2><a href="http://localhost:8081/resetpswd/' + token + '">Click here</a>'
                        // if (email.sendEmail(req.body.email, subject, html)) {
                        email.sendEmail("addUsers",req.body.email, subject, html)
                        var sql = "SELECT `ROLES` FROM tbl_user_roles"
                        connection.query(sql, function (err, roles) {
                            if (err) {
                                throw err;
                                res.redirect('500')
                            }
                            console.log(sql + "---" + JSON.stringify(roles))
                            if (roles.length >= 0) {
                                // res.render('manage', {
                                //     title: 'Manage users',
                                //     status: true,
                                //     message: 'User account created and password link mailed to new user!',
                                //     username: req.session.user.email,
                                //     firstName: req.session.user.firstName,
                                //     roles: roles
                                // })
                                res.send({
                                    status: true,
                                    message: 'User account created and password link mailed to new user!'
                                })
                            } else {
                                res.render('manage', {
                                    title: 'Internal error',
                                    status: false,
                                    message: 'Error occured while adding user!',
                                    username: req.session.user.email,
                                    firstName: req.session.user.firstName,
                                })
                            }
                        })
                        // }
                    }
                });
            });
        });
    } else {
        res.status(404);
    }
});

router.post('/get_users', function(req,res){
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var sql = "SELECT `firstName`, `lastName`, `email`, `role` FROM `tbl_users` ORDER BY `ID` DESC "
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
                res.redirect('500')
            }
            if (rows.length > 0) {
                res.status(200).send(rows)
            } 
        })
    } else {
        res.status(404);
    }
})

router.post('/delete_user', function(req,res){
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var sql = "DELETE FROM `tbl_users` WHERE `email`='"+req.body.email.toLowerCase()+"'"
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({'deleteStatus':false})
            }
                res.status(200).send({'deleteStatus':true})
           
        })
    } else {
        res.status(404);
    }
})

router.post('/edit_user', function(req,res){
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var sql = "UPDATE `tbl_users` SET `firstName`='"+req.body.firstname+"',`lastName`='"+req.body.lastname+"',`role`='"+req.body.role+"' WHERE `email`='"+req.body.email.toLowerCase()+"'"
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({'updateStatus':false})
            }
                res.status(200).send({'updateStatus':true})
           
        })
    } else {
        res.status(404);
    }
})
module.exports = router