var mysql = require("mysql");
const express = require('express')
const api = express.Router()
// set up connection with database.
var connection = require("../config/db_connection").testConnection;
console.log("Inside controllers/report_export.js");
api.get('/flag', function (req, res) {
            console.log("database connection successful");
            connection.query("SELECT `Raiser/Clearer` AS `NAME`, COUNT(Flag) AS `Number of Flags created` FROM `flags` WHERE EVENT='RAISED' OR EVENT='CLEARED' GROUP BY `Raiser/Clearer`", function (error, raisedCount, fields) {
                if (!!error) {
                    console.log('Error connecting to' + table_name);
                    console.error(error);
                } else {
                    connection.query("SELECT `Raiser/Clearer` AS `NAME`, COUNT(Flag) AS `Number of Flags created` FROM `flags` WHERE EVENT='CLEARED' GROUP BY `Raiser/Clearer`", function (error, clearedCleared, fields) {
                        if (!!error) {
                            if (error.errno == 1146) {
                                res.render('500.ejs', {
                                    status: 500,
                                    title: 'Table not found',
                                    message: "Table not found",
                                    username: username,
                                    firstName: firstName
                                });
                            }
                            console.log(error);
                        } else {
                            var rows = raisedCount;
                            // var totalCount = 0;
                            var totalCount = rows.length;
                            // for (var i = 0; i < raisedCount.length; i++) {
                            //     for (var j = 0; j < clearedCleared.length; j++) {
                            //         if(raisedCount[i].NAME == clearedCleared[j].NAME&&clearedCleared[j]['Number of Flags created']>0){
                            //             rows[i]['Number of Flags created']-=clearedCleared[j]['Number of Flags created']
                            //             if(rows[i]['Number of Flags created']<0){
                            //                 rows[i]['Number of Flags created']=0
                            //             }
                            //             totalCount+=rows[i]['Number of Flags created']
                            //         }
                            //     }
                            // }
                            var username = req.session.user.email;
                            var firstName = req.session.user.firstName;
                            if (rows.length > 0) {
                                res.render('report_viewer.ejs', {
                                    title: 'Flags report',
                                    rows: rows,
                                    message: "success",
                                    total:{"label":"Total flags count:","count":totalCount},
                                    username: username,
                                    firstName: firstName
                                });
                            } else {
                                res.render('report_viewer.ejs', {
                                    title: 'Flags report',
                                    message: "dataNotFound",
                                    username: username,
                                    firstName: firstName
                                });
                            }
                            // res.send(rows);
                        }
                    })
                    }
                console.log("Inside Flag report SQL function")
            })

})
api.get('/meetings', function (req, res) {

            console.log("database connection successful");
            var username = req.session.user.email;
            var firstName = req.session.user.firstName;
            connection.query("select `Schedule Owner`,count(*) as Cancelled, 0 as Created,0 as `Total appointments` from appointments where event = 'CANCELLED' and `Student ID` is not null and `Student ID` != '------' group by `Schedule Owner` ", function (error, cancelledRows) {
                if (!!error) {
                    if (error.errno == 1146) {
                        res.render('500.ejs', {
                            status: 500,
                            title: 'Table not found',
                            message: "Table not found",
                            username: username,
                            firstName: firstName
                        });
                    }
                    console.log(error);
                } else {
                    connection.query("select `Schedule Owner`,count(*) as Created from appointments where event != 'CANCELLED' and `Student ID` is not null and `Student ID` != '------' and `Student ID` is not null and `Student ID` != '------' group by `Schedule Owner` ", function (error, createdRows) {
                        if (!!error) {
                            if (error.errno == 1146) {
                                res.render('500.ejs', {
                                    status: 500,
                                    title: 'Table not found',
                                    message: "Table not found",
                                    username: username,
                                    firstName: firstName
                                });
                            }
                            console.log(error);
                        } else {
                            var totalCount = 0;
                            cancelledRows.forEach(cancelledRow => {
                                createdRows.forEach(createdRow=>{
                                    if(cancelledRow['Schedule Owner']==createdRow['Schedule Owner']){
                                    cancelledRow['Created']=createdRow['Created']
                                    cancelledRow['Total appointments']=parseInt(cancelledRow['Created'])+parseInt(cancelledRow['Cancelled']);
                                    totalCount+=cancelledRow['Total appointments'];
                                    }
                                })
                            });
                            var fields = cancelledRows;

                            if (fields.length > 0) {
                                res.render('report_viewer.ejs', {
                                    title: 'Meeting report',
                                    rows: fields,
                                    message: "success",
                                    total:{"label":"Total meetings count:","count":totalCount},
                                    username: username,
                                    firstName: firstName
                                });
                            } else {
                                res.render('report_viewer.ejs', {
                                    title: 'Meeting report',
                                    message: "dataNotFound",
                                    username: username,
                                    firstName: firstName
                                });
                            }
                        }
                        console.log("Inside Flag report SQL function")
                    })
                }
            })

})
api.get('/', (req, res, next) => {
    res.render('report.ejs', {
        title: 'Select report',
        username: req.session.user.email,
        firstName: req.session.user.firstName
    })
})
api.post('/lastUpdated', function (req, res) {
    // console.log("Inside report_export.js lastUpdated")
    res.setHeader('Content-Type', 'application/json')
            connection.query("SELECT `FLAG`,`LAST_UPDATED` FROM `upload_status` WHERE `TABLE_NAME` = 'File Upload' ORDER BY ID DESC LIMIT 1", function (error, data) {
                if (error) {
                    console.log('Error in the query');
                    console.log(error)
                } else {
                    res.send(data);
                }
            })
})
module.exports = api