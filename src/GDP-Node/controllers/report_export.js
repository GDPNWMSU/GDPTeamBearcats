var mysql = require("mysql");
const express = require('express')
const api = express.Router()
// set up connection with database.
var connection = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    dateStrings: 'date'
});
console.log("Inside controllers/report_export.js
api.get('/flag',function (req,res) {
     connection.getConnection(function (error, instconn) {
         if (!!error) {
             instconn.release();
             console.log("Problem in connecting database");
         } else {
             console.log("database connection successful");
                instconn.query("SELECT `Raiser/Clearer` AS `NAME`, COUNT(Flag) AS `Number of Flags created` FROM `flags` WHERE EVENT='RAISED' GROUP BY `Raiser/Clearer`", function (error, rows, fields) {
                instconn.release();
                    if (!!error) {
                        console.log('Error connecting to' + table_name);
                        console.error(error);
                    } else {
                        if(rows.length>0){
                            res.render('report_viewer.ejs', {
                                title: 'Flags report',
                                rows : rows,
                                message: "success"
                            });
                        }else{
                            res.render('report_viewer.ejs', {
                                title: 'Flags report',
                                message: "dataNotFound"
                            });
                            }
                        // res.send(rows);
                    }
                    console.log("Inside Flag report SQL function")
                })
             

         }
     })
})
api.get('/', (req, res, next) => {
    res.render('report.ejs', {
        title: 'Select report'
    })
})
// api.get('/',function (req,res) {
//     connection.getConnection(function (error, instconn) {
//         if (!!error) {
//             // instconn.release();
//             console.log("Problem in connecting database");
//         } else {
//             console.log("database connection successful");
//             // instconn.query("SELECT * FROM imported_files", function (error, rows, fields) {
//             instconn.query("SELECT table_name FROM information_schema.tables where table_schema='test'", function (error, tables, fields) {
//                 instconn.query("SELECT FLAG FROM `upload_status` ORDER BY ID DESC", function (error, status, fields) {
//                 instconn.release();
//                 if (!!error) {
//                     console.log('Error in the query');
//                 } else {
                    
//                     res.render('view_database.ejs', {
//                         title: 'View data from database',
//                         tables: tables,
//                         status: status,
//                         message: "success"
//                     });
//                 }
//                     console.log("Inside data renderer")
//             })
//         })
//         }
//     })

// })
module.exports = api