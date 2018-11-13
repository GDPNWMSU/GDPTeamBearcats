var mysql = require("mysql");
const express = require('express')
const router = express.Router()
var connection = require("../config/db_connection").testConnection
console.log("Inside controllers/data_export.js")
router.get('/:table_name', function (req, res) {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    const table_name = req.params.table_name;
    if (typeof table_name != 'undefined' && table_name != 'favicon.ico' && table_name != '') {
        connection.query("SELECT table_name FROM information_schema.tables where table_schema='test'", function (error, tables, fields) {
            connection.query("SELECT * FROM `" + table_name + "`", function (error, rows, fields) {
                if (!!error) {
                    if (error.errno == 1146) {
                        res.render('view_database.ejs', {
                            title: 'Table not found',
                            message: "Table not found",
                            tables: tables,
                            username: username,
                            firstName: firstName
                        });
                    }
                    console.log('Error connecting to' + table_name);
                    console.error(error);
                } else {
                    if (rows.length > 0) {
                        res.render('view_database.ejs', {
                            title: 'View data from ' + table_name,
                            message: "success",
                            tables: tables,
                            rows: rows,
                            username: username,
                            firstName: firstName
                        });
                    } else {
                        res.render('view_database.ejs', {
                            title: 'View data from ' + table_name,
                            message: "success",
                            tables: tables,
                            username: username,
                            firstName: firstName
                        });
                    }
                    // res.send(rows);
                }
                console.log("Inside /:table renderer")
            })
        })

    }

})
router.get('/', function (req, res) {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    console.log("database connection successful");
    connection.query("SELECT table_name FROM information_schema.tables where table_schema='test'", function (error, tables, fields) {
        connection.query("SELECT FLAG FROM `upload_status` ORDER BY ID DESC", function (error, status, fields) {
            if (!!error) {
                console.log('Error in the query');
            } else {
                res.render('view_database.ejs', {
                    title: 'View data from database',
                    tables: tables,
                    status: status,
                    message: "success",
                    username: username,
                    firstName: firstName
                });
            }
            console.log("Inside data renderer")
        })
    })
})
module.exports = router