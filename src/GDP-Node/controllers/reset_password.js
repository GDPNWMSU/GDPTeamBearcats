const express = require("express");
const router = express.Router()
const connection = require('../config/db_connection').usersConnection;
const crypto = require('crypto');


router.get("/resetpswd/:token", function(req, res) {
    connection.query("select * from tbl_users where resettoken = ?", [req.params.token], function(err, rows){
      if(rows.length>0){
        console.log("rows", rows[0].username);
        res.render("reset_password", {title:'Reset password','message' : req.flash('message'), token: req.params.token});
      }
      else{
        res.render("404", {title:'Page not found'});
      }
      
    });
    });
    
    
router.post("/resetpswd",function(req, res){
        let pwd = req.body.password;
        let confpwd = req.body.confirm_password;
        let token = req.body.token;
        if(pwd === confpwd){
          cryptoPwd = crypto.createHash('sha1').update(''+pwd).digest('hex');
          connection.query("update tbl_users SET password = ? , resettoken = ? where resettoken = ?", [cryptoPwd, "", token] , function(err, rows){
            console.log(err,rows);
            if(!err){
                res.render("login", {title:'login','message' : "Password reset successfully" })      
            }
        });
          
        }else{
          res.render("reset_password", {title:'Reset Password','message' : "Passsword mismatch" });
        }
    
    });
    
    module.exports = router;