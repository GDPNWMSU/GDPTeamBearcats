var express = require('express')
var mysql = require("mysql");
var logger=require('morgan')
var engines = require('consolidate')
var connection = require('../config/db_connection');
var bodyParser = require('body-parser');
const router = express.Router()


let message = ''
router.get('/', (req, res, next) => {
    res.render('profile.ejs', {
        title: 'profile',
        message: message
    })
})
router.use(bodyParser.urlencoded({extended: false}));

router.post('/add_profile', function(request, response){
    console.log(request.body);      
        var sql = `INSERT INTO profile VALUES ('${request.body.first_name}','${request.body.last_name}','${request.body.mobile}','${request.body.email}','${request.body.password}','${request.body.password2}');`
        connection.query(sql, function (err, result) {
          if (err){
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