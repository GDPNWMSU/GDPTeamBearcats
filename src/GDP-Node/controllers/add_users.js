var express = require('express')
var mysql = require("mysql");
var logger=require('morgan')
var engines = require('consolidate')
var connection = require('../config/db_connection');
var bodyParser = require('body-parser');
const router = express.Router()


let message = ''
router.get('/', (req, res, next) => {
    res.render('add_users.ejs', {
        title: 'add_users',
        message: message
    })
})
router.use(bodyParser.urlencoded({extended: false}));

router.post('/add_user', function(request, response){
    console.log(request.body);      
        var sql = `INSERT INTO add_user VALUES ('${ request.body.username}','${ request.body.firstname}','${ request.body.lastname}','${ request.body.Role}');`
        connection.query(sql, function (err, result) {
          if (err){
           message = false
           response.redirect('/add_users/')
            throw err;
          } 
          
          console.log("1 record inserted");
          message = true
          response.redirect('/add_users/')
        });
        
  });




module.exports = router