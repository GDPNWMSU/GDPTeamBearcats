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
console.log("Inside controllers/report_export.js");
api.get('/flag', function (req, res) {
    connection.getConnection(function (error, instconn) {
        if (!!error) {
            instconn.release();
            console.log("Problem in connecting database");
        } else {
            console.log("database connection successful");
            instconn.query("SELECT `Raiser/Clearer` AS `NAME`, COUNT(Flag) AS `Number of Flags created` FROM `flags` WHERE EVENT='RAISED' GROUP BY `Raiser/Clearer`", function (error, raisedCount, fields) {
                if (!!error) {
                    console.log('Error connecting to' + table_name);
                    console.error(error);
                } else {
                    instconn.query("SELECT `Raiser/Clearer` AS `NAME`, COUNT(Flag) AS `Number of Flags created` FROM `flags` WHERE EVENT='CLEARED' GROUP BY `Raiser/Clearer`", function (error, clearedCleared, fields) {
                        instconn.release();
                        if (!!error) {
                            console.log('Error connecting to' + table_name);
                            console.error(error);
                        } else {
                            var rows = raisedCount;
                            var totalCount = 0;
                            for (var i = 0; i < raisedCount.length; i++) {
                                for (var j = 0; j < clearedCleared.length; j++) {
                                    if(raisedCount[i].NAME == clearedCleared[j].NAME&&clearedCleared[j]['Number of Flags created']>0){
                                        rows[i]['Number of Flags created']-=clearedCleared[j]['Number of Flags created']
                                        if(rows[i]['Number of Flags created']<0){
                                            rows[i]['Number of Flags created']=0
                                        }
                                        totalCount+=rows[i]['Number of Flags created']
                                    }
                                }
                            }
                            var username = req.session.user.username;
                            var firstName = req.session.user.firstName;
                            if (rows.length > 0) {
                                res.render('report_viewer.ejs', {
                                    title: 'Flags report',
                                    rows: rows,
                                    message: "success",
                                    total:{"label":"Total meetings count:","count":totalCount},
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
        }
    })
})
api.get('/meetings', function (req, res) {
    connection.getConnection(function (error, instconn) {
        if (!!error) {
            instconn.release();
            console.log("Problem in connecting database");
        } else {
            console.log("database connection successful");
            instconn.query("SELECT `Schedule Owner` AS `NAME`,COUNT(`Event`) AS `Number of Meetings` FROM `appointments` WHERE `Event` = 'CREATED' GROUP BY `Schedule Owner`", function (error, createdCount, fields) {
                if (!!error) {
                    console.log('Error connecting to' + table_name);
                    console.error(error);
                } else {
                    instconn.query("SELECT `Schedule Owner` AS `NAME`,COUNT(`Event`) AS `Number of Meetings` FROM `appointments` WHERE `Event` = 'CANCELLED' GROUP BY `Schedule Owner`", function (error, cancelledCount, fields) {
                        instconn.release();
                        if (!!error) {
                            console.log('Error connecting to' + table_name);
                            console.error(error);
                        } else {
                            var rows = createdCount;
                            var totalCount=0;
                            for (var i = 0; i < createdCount.length; i++) {
                                for (var j = 0; j < cancelledCount.length; j++) {
                                    if(createdCount[i].NAME == cancelledCount[j].NAME&&cancelledCount[j]['Number of Meetings']>0){
                                        rows[i]['Number of Meetings']-=cancelledCount[j]['Number of Meetings']
                                        if(rows[i]['Number of Meetings']<0){
                                            rows[i]['Number of Meetings']=0
                                        }
                                        totalCount+=rows[i]['Number of Meetings']
                                    }
                                }
                            }
                            var username = req.session.user.username;
                            var firstName = req.session.user.firstName;
                            if (rows.length > 0) {
                                res.render('report_viewer.ejs', {
                                    title: 'Meeting report',
                                    rows: rows,
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
                            // res.send(rows);
                        }
                    })
                    }
                console.log("Inside Flag report SQL function")
            })
        }
    })
})
api.get('/', (req, res, next) => {
    res.render('report.ejs', {
        title: 'Select report',
        username: req.session.user.username,
        firstName: req.session.user.firstName
    })
})
api.post('/lastUpdated', function (req, res) {
    // console.log("Inside report_export.js lastUpdated")
    res.setHeader('Content-Type', 'application/json')
    connection.getConnection(function (error, instconn) {
        if (error) {
            console.log("Problem in connecting database");
        } else {
            instconn.query("SELECT FLAG,TIMESTAMP FROM `upload_status` ORDER BY ID DESC LIMIT 1", function (error, data) {
                instconn.release();
                if (error) {
                    console.log('Error in the query');
                    console.log(error)
                } else {
                    res.send(data);
                    // console.log(data)
                }
            })
        }
    })

})
module.exports = api