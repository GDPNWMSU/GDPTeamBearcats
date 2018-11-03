var express = require('express')
var mysql = require("mysql");
var logger = require('morgan')
var engines = require('consolidate')
var connection = require('../config/db_connection');
var bodyParser = require('body-parser');
const router = express.Router()
var crypto = require('crypto');
let mail = require('../config/mail');

router.get('/', (req, res, next) => {

})
router.use(bodyParser.urlencoded({ extended: false }));




module.exports = router