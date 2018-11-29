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
function camelize(str) {
    var names = str.split(" ");
    var finalName = "";
    names.forEach(name => {
        finalName+=name.charAt(0).toUpperCase()+name.substr(1).toLowerCase()+" ";
    });
    return finalName.substr(0,finalName.length-1);
  }
router.post('/add_users', function (req, res) {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var salt = 'newAdd' + Date.now()
        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        var sql = "INSERT INTO `tbl_users`(`email`, `password`, `firstName`, `lastName`,`role`) VALUES ('" + req.body.email.toLowerCase() + "','" + encPassword + "','";
        sql += camelize(req.body.firstname) + "','" + camelize(req.body.lastname) + "','" + req.body.role + "')";
        var fullName = req.body.firstname+" "+req.body.lastname;
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
                        const email = require('../config/mail');
                        var subject = 'Pending account!'
                       var html = '<html><head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <title>Account pending!</title> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"></head><body style="font-family:\'Open Sans\', sans-serif;"> <div class="container"> <div class="row"> <center> <img src="http://'+process.env.IP+":"+process.env.PORT+'/img/mail_logo.jpg" height="120px" width="95px"/> </center> </div><div class="row"> <div class="col-xs-offset-1 col-md-offset-1" style="padding-top:30px;"><br/> <p>Hello '+camelize(fullName)+',<br/> <br/> Welcome to Student Success Center reporting application. A new account has been created for you by SSCRA Admin. To complete your profile please click the button below and create a new password. <br/> <br/> This is an automated mail and replies to this mail will not be monitored. In case of any issues or queries please contact us using the Contact Us page from the application. <br/> <center> <h3><a class="btn btn-success btn-lg" href="http://'+process.env.IP+":"+process.env.PORT+"/resetpswd/" + token + '"> Click here! </a> </h3> </center> <br/> Thanks and Regards,<br/> SSCRA Northwest </p></div></div></div></body></html>'
                        // var html = '<h2>Create new password</h2><a href="http://localhost:8081/resetpswd/' + token + '">Click here</a>'
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