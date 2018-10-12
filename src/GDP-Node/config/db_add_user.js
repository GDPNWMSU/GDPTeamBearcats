
var mysql        = require('mysql');
var connection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host     : "localhost",
  user     : "root",
  password : "",
  database : "add_users"
});

// connection.connect(function (err) {
//     if(err){
//         throw err;
//         console.log("connected to database");
//     }
// });

// connection.get('/',function(req,res){
//     connection.query("SELECT * FROM add_user",function(error,rows,field){
// if(!!error){
//     console.log('error');
// }  
// else{
//     console.log('connected');
// }  });

// });

module.exports = connection;