const express = require("express");
const router = express.Router()
const connection = require('../config/db_connection');
const crypto = require('crypto');
const mail = require('../mail');

// Reset Password
router.get("/forgotpswd", function(req, res){
    res.render('forgot_password', {title:'Forgot password','message' : req.flash('message')});
  });
  
router.post("/forgotpswd", function(req, res){
      let username = req.body.username;
      connection.query("select * from tbl_users where email = ?", [username], function(err, rows){
        console.log(err);
        if(rows.length>0){
          console.log("rows", rows[0].username);
          crypto.randomBytes(20, function(err, buf) {
            let token = buf.toString('hex');
            connection.query("update tbl_users SET resettoken = ? where email = ?", [token, username] , function(err, rows){
                console.log(err,rows);
                if(!err){
                    mail("Forgot Password Link", username, "http://localhost:8081/resetpswd/"+ token);
                }
            });
          });
  
          res.render('forgot_password', {title:'Forgot Password','message' : 'Reset Password link sent to your mail'});
        }
        else{
          res.render('forgot_password', {title:'Forgot Password','message' : 'Invalid Username'});
        }
      });
  });
module.exports = router;