var mysql = require("mysql");
const express = require('express')
const api = express.Router()
// set up connection with database.
console.log("inside controller")
var connection = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
api.get('/', function (req, res) {
    const table_name = req.params.table_name;
    connection.getConnection(function (error, instconn) {
        if (!!error) {
            instconn.release();
            console.log("Problem in connecting database");
        } else {
            console.log("database connection successful");
            // instconn.query("SELECT * FROM imported_files", function (error, rows, fields) {
            instconn.query("DROP DATABASE `test`", function (error, tables, fields) {
                    if (!!error) {
                        console.log('Error connecting to' + table_name);
                        console.error(error);
                    } else {
                        instconn.query("CREATE DATABASE `test`", function (error, tables, fields) {
                        if(!!error){
                            console.log('Error creating database');
                        }else{
                            createStatusTable(instconn,res);
                           
                        }
                        // res.send(rows);
                        })
                    }
                    console.log("Inside db drop")
            })
             
        }
    })
})
function createStatusTable(instconn,res) {
     instconn.query("CREATE TABLE `test`.`upload_status` (`ID` INT(3) NOT NULL AUTO_INCREMENT, `FLAG` VARCHAR(10) NOT NULL , `TIMESTAMP` TIMESTAMP NOT NULL , PRIMARY KEY (`ID`))", function (error, tables, fields) {
         if (!!error) {
             console.log('Error creating status table');
         }else{
             console.log('create status table');
            instconn.query("INSERT INTO `test`.`upload_status` (`FLAG`, `TIMESTAMP`) VALUES ('empty', CURRENT_TIMESTAMP);", function (error, tables, fields) {
                instconn.release();
                if (!!error) {
                    console.log('Error initiating status table');
                    console.error(error);
                }else{
                    console.log('insert status table');
                    res.redirect('/')
                } 
                // res.send(rows);
            })
         }
         // res.send(rows);
     })
}
// api.get('/', function (req, res) {
//     connection.getConnection(function (error, instconn) {
//         if (!!error) {
//             instconn.release();
//             console.log("Problem in connecting database");
//         } else {
//             console.log("database connection successful");
//             // instconn.query("SELECT * FROM imported_files", function (error, rows, fields) {
//             instconn.query("SELECT table_name FROM information_schema.tables where table_schema='test'", function (error, tables, fields) {
//                 instconn.release();
//                 if (!!error) {
//                     console.log('Error in the query');
//                 } else {
//                     res.render('index.ejs', {
//                         title: 'View data from database',
//                         tables: tables
//                     });
//                 }
//                 console.log("Inside data renderer")
//             })
//         }
//     })

// })
module.exports = api