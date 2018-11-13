const express = require("express");
const router = express.Router()
const connection = require('../config/db_connection').usersConnection;
const crypto = require('crypto');

// Reset Password
router.get("/forgotpswd", function (req, res) {
  console.log('user: '+process.env.MAIL_USER+
  'clientId:'+process.env.MAIL_CLIENTID+
  'clientSecret:'+process.env.MAIL_CLIENTSECRET+
  'refreshToken:'+process.env.MAIL_REFRESHTOKEN+
  'accessToken:'+process.env.MAIL_ACCESSTOKEN);
  res.render('forgot_password', { title: 'Forgot password', 'message': '' });
});

router.post("/forgotpswd", function (req, res) {
  let username = req.body.username;
  connection.query("select * from tbl_users where email = ?", [username], function (err, rows) {
    console.log(err);
    if (rows.length > 0) {
      // console.log("rows", rows[0].username);
      crypto.randomBytes(20, function (err, buf) {
        let token = buf.toString('hex');
        connection.query("update tbl_users SET resettoken = ? where email = ?", [token, username], function (err, rows) {
          // console.log(err, rows);
          if (!err) {
            const email = require('../config/mail');
              var subject = 'Northwest password reset'
              var html = '<h2>Password reset</h2><a href="http://localhost:8081/resetpswd/' + token + '">Click here</a>'
              var isMailSent = email.sendEmail("forgotPass",username,subject,html,res);
              console.log('isMailSent'+isMailSent);
            }
        });
      });


    }
    else {
      res.render('forgot_password', { title: 'Forgot Password', 'message': 'Invalid Username' });
    }
  });
});
module.exports = router;