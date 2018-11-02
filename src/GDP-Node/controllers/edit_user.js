var express = require('express')
var mysql = require("mysql");
var logger = require('morgan')
var engines = require('consolidate')
var connection = require('../config/db_connection');
var bodyParser = require('body-parser');
const router = express.Router()


// router.get('/', function (req, res) {
//     console.log("in edit")
//     res.render('edit_user')
// })

router.get('/', function (req, res) {
  console.log("in edit")
  var sql = `SELECT * from add_users;`
  connection.query(sql, function (err, result) {
    console.log(result)
    if (err) {
      throw err;
    }
    res.render('edit_user', {
      title: 'edit Users',
      data: result,
      username: req.session.user.email,
      firstName: req.session.user.firstName
    })
  })
})

router.get('/:id', function (req, res) {
  var sql = `SELECT * from add_users where pk = ${req.params.id};`
  connection.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    res.render('edit', {
      title: 'edit Users',
      data: result,
      username: req.session.user.email,
      firstName: req.session.user.firstName
    })
  })
})

router.post('/:id', function (req, res) {
  var sql = `update add_users set username = '${req.body.email}',firstName = '${req.body.firstname}', lastName = '${req.body.lastname}', role = '${req.body.Role}' where pk = ${req.params.id};`
  connection.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    res.redirect('/edit_users')
  })
})

// router.post('/delete_user', function (req, res) {
//   console.log("adsfg");
//   var sql = `delete from add_users where pk = ${req.body.delete};`
//   connection.query(sql, function (err, result) {
//     if (err) {
//       throw err;
//     }
//     res.redirect('/edit_users')
//   })
// })

module.exports = router

