
var mysql = require('mysql');
var mysql2 = require('mysql2/promise');
var userConnection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host     : "localhost",
  user     : "root",
  password : "",
  database : "db_users",
  dateStrings:true,
  timezone : 'utc'
});
var testConnection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host     : "localhost",
  user     : "root",
  password : "",
  database : "test",
  dateStrings:true,
  timezone : 'utc'
});
var asyncTestConnection =  mysql2.createConnection({
  connectionLimit:50,
  host     : "localhost",
  user     : "root",
  password : "",
  database : "test",
  dateStrings:true,
  timezone : 'utc'
})
module.exports.usersConnection = userConnection;
module.exports.testConnection = testConnection;
module.exports.asyncTestConnection = asyncTestConnection;