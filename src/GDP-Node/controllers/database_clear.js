var mysql = require("mysql");
const express = require('express')
const api = express.Router()
// set up connection with database.
console.log("inside controllers/database_clear.js")
var connection = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    dateStrings:true,
    timezone : 'utc'
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
                        if (!!error) {
                            console.log('Error creating database');
                        } else {
                            createStatusTable(instconn, res);

                        }
                        // res.send(rows);
                    })
                }
                console.log("Inside db drop")
            })

        }
    })
})
function createStatusTable(instconn, res) {

    instconn.query("CREATE TABLE  `test`.`upload_status` (`ID` int NOT NULL AUTO_INCREMENT,`FLAG` varchar(10) NOT NULL,`START_TIMESTAMP` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',`END_TIMESTAMP` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',`TABLE_NAME` varchar(20) NOT NULL,`LAST_UPDATED` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , PRIMARY KEY(`ID`)) ", function (error, tables, fields) {
        if (!!error) {
            console.log('Error creating status table');
        } else {
            console.log('create status table');
            instconn.query("INSERT INTO `test`.`upload_status` (`FLAG`,`TABLE_NAME`, `LAST_UPDATED`) VALUES ('empty','File Upload', CURRENT_TIMESTAMP);", function (error, tables, fields) {
                if (!!error) {
                    console.log('Error initiating status table');
                    console.error(error);
                } else {
                    console.log('insert status table');

                    res.redirect('/')
                }
                // res.send(rows);
            })
        }
        // res.send(rows);
    })
}

module.exports = api


