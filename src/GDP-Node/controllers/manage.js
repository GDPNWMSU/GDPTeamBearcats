const express = require('express')
const router = express.Router()
const connection = require('../config/db_connection').usersConnection;
var logger = require('morgan')
var bodyParser = require('body-parser');
var crypto = require('crypto');
let mail = require('../config/mail');
var network = require('network');
var os = require('os');
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
    if (req.session.user.email != null && req.session.user.firstName != null && req.body.email != undefined && req.body.email.trim() != ""&&isEmailAddress(req.body.email.trim().toLowerCase())) {
        connection.query("SELECT email FROM tbl_users WHERE email='" + req.body.email.toLowerCase() + "'", function (err, rows) {
            if (err) {
                throw err;
                res.redirect('500')
            }
            if (rows.length > 0) {
                res.status(200).json({ 'doesUserExist': true })
            } else {
                res.status(200).json({ 'doesUserExist': false })
            }
        })
    } else {
        res.status(false);
    }
})
function isEmailAddress(str) {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return str.match(pattern);
}

function camelize(str) {
    var names = str.split(" ");
    var finalName = "";
    names.forEach(name => {
        finalName += name.charAt(0).toUpperCase() + name.substr(1).toLowerCase() + " ";
    });
    return finalName.substr(0, finalName.length - 1);
}

router.post('/add_users', function (req, res) {
    if (req.session.user.email != null && req.session.user.firstName != null && isEmailAddress(req.body.email.trim().toLowerCase())) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var salt = 'newAdd' + Date.now()
        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        var sql = "INSERT INTO `tbl_users`(`email`, `password`, `firstName`, `lastName`,`role`) VALUES ('" + req.body.email.trim().toLowerCase() + "','" + encPassword + "','";
        sql += camelize(req.body.firstname) + "','" + camelize(req.body.lastname) + "','" + req.body.role + "')";
        var fullName = req.body.firstname + " " + req.body.lastname;
        console.log(camelize(fullName))
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
                        // network.get_active_interface(function (err, obj) {
                            var getHostAddress = "http://"
                            getHostAddress += process.env.hostname ||os.hostname()
                            getHostAddress += ":"+process.env.PORT
                            const email = require('../config/mail');
                            var subject = 'Pending account!'
                            var html = '<html><head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <title>Password reset!</title> </head><body style="font-family:\'Open Sans\', sans-serif;"> <div class="container"> <div class="row"> <center> <img src="' + getHostAddress + '/img/mail_logo.jpg" height="120px" width="95px"/> </center> </div><div class="row"> <div class="col-xs-offset-1 col-md-offset-1" style="padding-top:30px;"><br/> <p>Hello ' + camelize(fullName) + ',<br/> <br/> Welcome to Student Success Center reporting application. A new account has been created for you by SSCRA Admin. To complete your profile please click the button below and create a new password. <br/> <br/> This is an automated mail and replies to this mail will not be monitored. In case of any issues or queries please contact us using the Contact Us page from the application. <br/> <center> <h3> <a href="' + getHostAddress + "/resetpswd/" + token + '" style=" color:white;text-decoration:none; height:50px; background-color:#eb0028; line-height:50px; border-radius:2px; font-size:18px; text-align:center; color:#ffffff !important;display: block;width: 100%;border: none;margin: 0;" target="_blank">Click here!</a></h3></center> <br/> Thanks and Regards,<br/> SSCRA Northwest </p></div></div></div></body></html>'
                            email.sendEmail("addUsers", req.body.email, subject, html)
                            var sql = "SELECT `ROLES` FROM tbl_user_roles"
                            connection.query(sql, function (err, roles) {
                                if (err) {
                                    if (error.errno == 1146) {
                                        res.render('view_database.ejs', {
                                            status: 500,
                                            title: 'Table not found',
                                            message: "Table not found",
                                            username: username,
                                            firstName: firstName
                                        });
                                    } else {
                                        res.render('500.ejs', {
                                            status: 500,
                                            title: 'Table not found',
                                            message: "Table not found",
                                            username: username,
                                            firstName: firstName
                                        });
                                    }
                                }
                                if (roles.length >= 0) {
                                    res.send({
                                        status: true,
                                        message: 'User account created and password link mailed to new user!'
                                    })
                                } else {
                                    res.render('500.ejs', {
                                        title: 'Internal error',
                                        status: 500,
                                        message: 'Error occured while adding user!',
                                        username: req.session.user.email,
                                        firstName: req.session.user.firstName,
                                    })
                                }
                            })
                        // })
                    }
                });
            });
        });
    } else {
        res.render("/");
    }
});

router.post('/get_users', function (req, res) {
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
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
        res.status(false);
    }
})

router.post('/delete_user', function (req, res) {
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var sql = "DELETE FROM `tbl_users` WHERE `email`='" + req.body.email.toLowerCase() + "'"
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ 'deleteStatus': false })
            }
            res.status(200).send({ 'deleteStatus': true })

        })
    } else {
        res.render("/");
    }
})

router.post('/edit_user', function (req, res) {
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var sql = "UPDATE `tbl_users` SET `firstName`='" + req.body.firstname + "',`lastName`='" + req.body.lastname + "',`role`='" + req.body.role + "' WHERE `email`='" + req.body.email.toLowerCase() + "'"
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ 'updateStatus': false })
            }
            res.status(200).send({ 'updateStatus': true })

        })
    } else {
        res.status(404);
    }
})

module.exports = router
module.exports.checkUser = function(email) {
    var sql = 
    connection.query("SELECT email FROM tbl_users WHERE email='" + email.toLowerCase() + "'", function (err, rows) {
        if (err) {
            throw err;
            // res.redirect('500')
        }
        if (rows.length > 0) {
            return true
        } else {
            return false
        }
    })
    return true
}