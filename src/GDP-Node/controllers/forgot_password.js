const express = require("express");
const router = express.Router()
const connection = require('../config/db_connection').usersConnection;
const crypto = require('crypto');
const network = require('network');
var os = require('os');
// Reset Password
router.get("/", function (req, res) {
  console.log('user: '+process.env.MAIL_USER+
  'clientId:'+process.env.MAIL_CLIENTID+
  'clientSecret:'+process.env.MAIL_CLIENTSECRET+
  'refreshToken:'+process.env.MAIL_REFRESHTOKEN+
  'accessToken:'+process.env.MAIL_ACCESSTOKEN);
  res.render('forgot_password', { title: 'Forgot password', 'message': '' });
});
function camelize(str) {
  var names = str.split(" ");
  var finalName = "";
  names.forEach(name => {
      finalName+=name.charAt(0).toUpperCase()+name.substr(1).toLowerCase()+" ";
  });
  return finalName.substr(0,finalName.length-1);
}
function getIP(){
  return network.get_active_interface(function(err, obj) {
    var ip = obj.ip_address+":"+process.env.PORT
    console.log(ip)
    return obj.ip_address+":"+process.env.PORT
 })
}
router.post("/", function (req, res) {
  let username = req.body.username;

  connection.query("select * from tbl_users where email = ?", [username], function (err, rows) {
    console.log(err);
    if (rows.length > 0) {
      // console.log("rows", rows[0].username);
      var fullName = rows[0].firstName+" "+rows[0].lastName;
      crypto.randomBytes(20, function (err, buf) {
        let token = buf.toString('hex');
        connection.query("update tbl_users SET resettoken = ? where email = ?", [token, username], function (err, rows) {
          // console.log(err, rows);
          if (!err) {
            const email = require('../config/mail');
            network.get_active_interface(function(err, obj) {
              var getHostAddress = "http://"
              getHostAddress += process.env.hostname ||os.hostname()
              getHostAddress += ":"+process.env.PORT
              var alternateIP = obj.ip_address+":"+process.env.PORT
              var subject = 'SSCRA password assistance'
              var html = '<html><head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <title>Password reset!</title> </head><body style="font-family:\'Open Sans\', sans-serif;"> <div class="container"> <div class="row"> <center> <img src="'+getHostAddress+'/img/mail_logo.jpg" height="120px" width="95px"/> </center> </div><div class="row"> <div class="col-xs-offset-1 col-md-offset-1" style="padding-top:30px;"><br/> <p>Hello '+camelize(fullName)+',<br/> <br/> We received a request to reset the password for the SSCRA associated with this e-mail address. Click the link below to reset your password. <br/> <br/> This is an automated mail and replies to this mail will not be monitored. In case of any issues or queries please contact us using the Contact Us page from the application. <br/> <center> <h3> <a href="'+getHostAddress+"/resetpswd/" + token + '" style=" color:white;text-decoration:none; height:50px; background-color:#eb0028; line-height:50px; border-radius:2px; font-size:18px; text-align:center; color:#ffffff !important;display: block;width: 100%;border: none;margin: 0;" target="_blank">Click here!</a></h3></center> <br/>Having problem with the link?<a href="'+alternateIP+ "/resetpswd/" + token + '" target=\"_blank\"> Click here</a> <br/> <br/> Thanks and Regards,<br/> SSCRA Northwest </p></div></div></div></body></html>'              
              var isMailSent = email.sendEmail("forgotPass",username,subject,html,res);
              console.log('isMailSent'+isMailSent);
            })
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