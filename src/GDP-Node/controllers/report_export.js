var mysql = require("mysql");
const express = require('express')
const api = express.Router()
// set up connection with database.
var connection = require("../config/db_connection").testConnection;
console.log("Inside controllers/report_export.js");
api.get('/flag/faculty', function (req, res) {
    handleFlagsReport(req, res, false);
})
api.post('/flag/faculty', function (req, res) {
    handleFlagsReportWithDateRange(req, res, false);
})
api.get('/flag/student', function (req, res) {
    handleStudentFlagsReport(req, res);
})
api.post('/flag/student', function (req, res) {
    handleStudentFlagsReportWithRange(req, res);
})
api.get('/meetings/:setDateBasedFilter', function (req, res) {
    if (req.params.setDateBasedFilter != null && req.params.setDateBasedFilter != '' && req.params.setDateBasedFilter == "tillDate") {
        handleMeetingsReport(req, res, true);
    } else {
        handleMeetingsReport(req, res);
    }
})
api.post('/meetings', function (req, res) {
    if (req.body.fromDate != '' && req.body.toDate != '') {
        handleMeetingsReportWithRange(req, res, true);
    } else {
        res.redirect('/lost')
    }
})
api.get('/meetings', function (req, res) {
    handleMeetingsReport(req, res, false);
})
api.get('/flag/student', function (req, res) {
    handleStudentFlagsReport(req, res);
})
api.get('/notes', function (req, res) {
    handleNotesReport(req, res);
})
api.post('/notes', function (req, res) {
    handleNotesReportWithRange(req, res);
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
function handleFlagsReport(req, res, isDateFilterSet) {
    var dateFilter = isDateFilterSet ? "`Date`<= curdate() and " : ""
    connection.query("SELECT `Raiser/Clearer` AS `NAME`, COUNT(Flag) AS `Number of Flags raised` FROM `flags` WHERE " + dateFilter + "EVENT='RAISED' OR EVENT='CLEARED' GROUP BY `Raiser/Clearer`", function (error, raisedCount, fields) {
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
            console.error(error);
        } else {
            connection.query("SELECT min(`Date`) as rangeStartDate ,max(`Date`) as rangeEndDate FROM test.flags", function (error, dateMinAndMax) {            
            var rows = raisedCount;
            var totalCount = 0;
            rows.forEach(selectedRow => {
                totalCount += parseInt(selectedRow['Number of Flags raised'])
            })
            var username = req.session.user.email;
            var firstName = req.session.user.firstName;
            if (rows.length > 0) {
                var rangeStartDate = new Date(dateMinAndMax[0]['rangeStartDate'])
                rangeStartDate = (rangeStartDate.getMonth() + 1) + '/' + rangeStartDate.getDate() + '/' + rangeStartDate.getFullYear()
                var rangeEndDate = new Date(dateMinAndMax[0]['rangeEndDate'])
                rangeEndDate = (rangeEndDate.getMonth() + 1) + '/' + rangeEndDate.getDate() + '/' + rangeEndDate.getFullYear()
                res.render('report_viewer.ejs', {
                    title: 'Faculty Flags report',
                    rows: rows,
                    message: "success",
                    total: { "label": "Total flags count:", "count": totalCount },
                    username: username,
                    firstName: firstName,
                    isMeetingsReport: false,
                    currentReport: 'flag/faculty',
                    rangeStartDate:rangeStartDate,
                    rangeEndDate:rangeEndDate
                });
            } else {
                res.render('report_viewer.ejs', {
                    title: 'Faculty Flags report',
                    message: "dataNotFound",
                    username: username,
                    firstName: firstName
                });
            }
        })
        }
        console.log("Inside Flag report")
    })
}
function handleFlagsReportWithDateRange(req, res, isDateFilterSet) {
    // var dateFilter = isDateFilterSet ? "`Date`<= curdate() and " : ""
    var dateFilter = '`Date` between "' + new Date(req.body.fromDate).toMysqlFormat() + '" and "' + new Date(req.body.toDate).toMysqlFormat() + '" and '
    connection.query("SELECT `Raiser/Clearer` AS `NAME`, COUNT(Flag) AS `Number of Flags raised` FROM `flags` WHERE " + dateFilter + "EVENT='RAISED' OR EVENT='CLEARED' GROUP BY `Raiser/Clearer`", function (error, raisedCount, fields) {
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
            console.error(error);
        } else {
            var rows = raisedCount;
            var totalCount = 0;
            rows.forEach(selectedRow => {
                totalCount += parseInt(selectedRow['Number of Flags raised'])
            })
            var username = req.session.user.email;
            var firstName = req.session.user.firstName;
            if (rows.length > 0) {
                res.render('report_viewer.ejs', {
                    title: 'Faculty Flags report',
                    rows: rows,
                    message: "success",
                    total: { "label": "Total flags count:", "count": totalCount },
                    username: username,
                    firstName: firstName,
                    isMeetingsReport: false,
                    currentReport: 'flag/faculty',
                    rangeStartDate:req.body.fromDate,
                    rangeEndDate:req.body.toDate
                });
            } else {
                res.render('report_viewer.ejs', {
                    title: 'Faculty Flags report',
                    message: "dataNotFound",
                    username: username,
                    firstName: firstName
                });
            }
        }
        console.log("Inside Flag report")
    })
}
function handleStudentFlagsReport(req, res) {
    connection.query("SELECT `Student Name`, `Flag`, COUNT(Flag) AS `Number of flags raised`, `Raiser/Clearer` as `Faculty` FROM test.flags where `Event`='RAISED' group by `Student Name`, `Student ID`, `Flag`", function (error, raisedCount, fields) {
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
            console.error(error);
        } else {
            connection.query("SELECT min(`Date`) as rangeStartDate ,max(`Date`) as rangeEndDate FROM test.flags", function (error, dateMinAndMax) {            
            var rows = raisedCount;
            var totalCount = 0;
            rows.forEach(selectedRow => {
                totalCount += parseInt(selectedRow['Number of flags raised'])
            })
            var username = req.session.user.email;
            var firstName = req.session.user.firstName;
            if (rows.length > 0) {
                var rangeStartDate = new Date(dateMinAndMax[0]['rangeStartDate'])
                rangeStartDate = (rangeStartDate.getMonth() + 1) + '/' + rangeStartDate.getDate() + '/' + rangeStartDate.getFullYear()
                var rangeEndDate = new Date(dateMinAndMax[0]['rangeEndDate'])
                rangeEndDate = (rangeEndDate.getMonth() + 1) + '/' + rangeEndDate.getDate() + '/' + rangeEndDate.getFullYear()
                res.render('report_viewer.ejs', {
                    title: 'Student Flags report',
                    rows: rows,
                    message: "success",
                    total: { "label": "Total flags count:", "count": totalCount },
                    username: username,
                    firstName: firstName,
                    isMeetingsReport: false,
                    currentReport: 'flag/student',
                    rangeStartDate:rangeStartDate,
                    rangeEndDate:rangeEndDate
                });
            } else {
                res.render('report_viewer.ejs', {
                    title: 'Student Flags report',
                    message: "dataNotFound",
                    username: username,
                    firstName: firstName
                });
            }
            // res.send(rows);
        })
        }
        console.log("Inside Flag report")
    })
}
function handleStudentFlagsReportWithRange(req, res) {
    var dateFilter = '`Date` between "' + new Date(req.body.fromDate).toMysqlFormat() + '" and "' + new Date(req.body.toDate).toMysqlFormat() + '" and '
    connection.query("SELECT `Student Name`, `Flag`, COUNT(Flag) AS `Number of flags raised`, `Raiser/Clearer` as `Faculty` FROM test.flags where " + dateFilter + "`Event`='RAISED' group by `Student Name`, `Student ID`, `Flag`", function (error, raisedCount, fields) {
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
            console.error(error);
        } else {
            var rows = raisedCount;
            var totalCount = 0;
            rows.forEach(selectedRow => {
                totalCount += parseInt(selectedRow['Number of flags raised'])
            })
            var username = req.session.user.email;
            var firstName = req.session.user.firstName;
            if (rows.length > 0) {
                res.render('report_viewer.ejs', {
                    title: 'Student Flags report',
                    rows: rows,
                    message: "success",
                    total: { "label": "Total flags count:", "count": totalCount },
                    username: username,
                    firstName: firstName,
                    isMeetingsReport: false,
                    currentReport: 'flag/student',
                    rangeStartDate:req.body.fromDate,
                    rangeEndDate:req.body.toDate
                });
            } else {
                res.render('report_viewer.ejs', {
                    title: 'Student Flags report',
                    message: "dataNotFound",
                    username: username,
                    firstName: firstName
                });
            }
            // res.send(rows);
        }
        console.log("Inside Flag report")
    })
}
function handleMeetingsReport(req, res, isDateFilterSet) {
    console.log("database connection successful");
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    var dateFilter = isDateFilterSet ? "`Event Date`<= curdate() and " : ""
    connection.query("select `Schedule Owner`,count(*) as Cancelled, 0 as Created,0 as `Total appointments` from appointments where " + dateFilter + "event = 'CANCELLED' and `Student ID` is not null and `Student ID` != '------' group by `Schedule Owner` ", function (error, cancelledRows) {
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
            connection.query("select `Schedule Owner`,count(*) as Created from appointments where " + dateFilter + "event != 'CANCELLED' and `Student ID` is not null and `Student ID` != '------' and `Student ID` is not null and `Student ID` != '------' group by `Schedule Owner` ", function (error, createdRows) {
                if (!!error) {
                    console.log(error);
                } else {
                    connection.query("SELECT min(`Event Date`) as rangeStartDate ,max(`Event Date`) as rangeEndDate FROM test.appointments", function (error, dateMinAndMax) {

                    var totalCount = 0;
                    cancelledRows.forEach(cancelledRow => {
                        createdRows.forEach(createdRow => {
                            if (cancelledRow['Schedule Owner'] == createdRow['Schedule Owner']) {
                                cancelledRow['Created'] = createdRow['Created']
                                cancelledRow['Total appointments'] = parseInt(cancelledRow['Created']) + parseInt(cancelledRow['Cancelled']);
                                totalCount += cancelledRow['Total appointments'];
                            }
                        })
                    });
                    var fields = cancelledRows;
                    if (fields.length > 0) {
                        var rangeStartDate = new Date(dateMinAndMax[0]['rangeStartDate'])
                        rangeStartDate = (rangeStartDate.getMonth() + 1) + '/' + rangeStartDate.getDate() + '/' + rangeStartDate.getFullYear()
                        var rangeEndDate = new Date(dateMinAndMax[0]['rangeEndDate'])
                        rangeEndDate = (rangeEndDate.getMonth() + 1) + '/' + rangeEndDate.getDate() + '/' + rangeEndDate.getFullYear()
                        res.render('report_viewer.ejs', {
                            title: 'Appointments report',
                            rows: fields,
                            message: "success",
                            total: { "label": "Total meetings count:", "count": totalCount },
                            username: username,
                            firstName: firstName,
                            currentReport: 'meetings',
                            isMeetingsReport: true,
                            rangeStartDate:rangeStartDate,
                            rangeEndDate:rangeEndDate
                        });
                    } else {
                        res.render('report_viewer.ejs', {
                            title: 'Meeting report',
                            message: "dataNotFound",
                            username: username,
                            firstName: firstName
                        });
                    }
                });
                }
                console.log("Inside Flag report SQL function")
            })
        }
    })
}
function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}
Date.prototype.toMysqlFormat = function () {
    return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());
};
function handleMeetingsReportWithRange(req, res) {
    console.log("database connection successful");
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    // var dateFilter = isDateFilterSet ? "`Event Date`<= curdate() and " : ""
    var dateFilter = '`Event Date` between "' + new Date(req.body.fromDate).toMysqlFormat() + '" and "' + new Date(req.body.toDate).toMysqlFormat() + '" and '
    connection.query("select `Schedule Owner`,count(*) as Cancelled, 0 as Created,0 as `Total appointments` from appointments where " + dateFilter + "event = 'CANCELLED' and `Student ID` is not null and `Student ID` != '------' group by `Schedule Owner` ", function (error, cancelledRows) {
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
            connection.query("select `Schedule Owner`,count(*) as Created from appointments where " + dateFilter + "event != 'CANCELLED' and `Student ID` is not null and `Student ID` != '------' and `Student ID` is not null and `Student ID` != '------' group by `Schedule Owner` ", function (error, createdRows) {
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
                        createdRows.forEach(createdRow => {
                            if (cancelledRow['Schedule Owner'] == createdRow['Schedule Owner']) {
                                cancelledRow['Created'] = createdRow['Created']
                                cancelledRow['Total appointments'] = parseInt(cancelledRow['Created']) + parseInt(cancelledRow['Cancelled']);
                                totalCount += cancelledRow['Total appointments'];
                            }
                        })
                    });
                    var fields = cancelledRows;

                    if (fields.length > 0) {
                        res.render('report_viewer.ejs', {
                            title: 'Appointments report',
                            rows: fields,
                            message: "success",
                            total: { "label": "Total meetings count:", "count": totalCount },
                            username: username,
                            firstName: firstName,
                            isMeetingsReport: true,
                            currentReport: 'meetings',
                            rangeStartDate: req.body.fromDate,
                            rangeEndDate: req.body.toDate
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
}
function handleNotesReport(req, res) {
    connection.query("SELECT `Note Author`,count(*) as `Number of notes` FROM test.`student report` group by `Note Author`,`Author ID`", function (error, raisedCount, fields) {
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
            console.error(error);
        } else {
            connection.query("SELECT min(`Note Date`) as rangeStartDate ,max(`Note Date`) as rangeEndDate FROM test.`student report`", function (error, dateMinAndMax) {            
            var rows = raisedCount;
            var totalCount = 0;
            rows.forEach(selectedRow => {
                totalCount += parseInt(selectedRow['Number of notes'])
            })
            var username = req.session.user.email;
            var firstName = req.session.user.firstName;
            if (rows.length > 0) {
                var rangeStartDate = new Date(dateMinAndMax[0]['rangeStartDate'])
                rangeStartDate = (rangeStartDate.getMonth() + 1) + '/' + rangeStartDate.getDate() + '/' + rangeStartDate.getFullYear()
                var rangeEndDate = new Date(dateMinAndMax[0]['rangeEndDate'])
                rangeEndDate = (rangeEndDate.getMonth() + 1) + '/' + rangeEndDate.getDate() + '/' + rangeEndDate.getFullYear()
                res.render('report_viewer.ejs', {
                    title: 'Notes report',
                    rows: rows,
                    message: "success",
                    total: { "label": "Total notes count:", "count": totalCount },
                    username: username,
                    firstName: firstName,
                    currentReport: 'notes',
                    isMeetingsReport: false,
                    rangeStartDate:rangeStartDate,
                    rangeEndDate:rangeEndDate
                });
            } else {
                res.render('report_viewer.ejs', {
                    title: 'Notes report',
                    message: "dataNotFound",
                    username: username,
                    firstName: firstName
                });
            }
            // res.send(rows);
        })
        }
        console.log("Inside Flag report")
    })
}
function handleNotesReportWithRange(req, res) {
    var dateFilter = '`Note Date` between "' + new Date(req.body.fromDate).toMysqlFormat() + '" and "' + new Date(req.body.toDate).toMysqlFormat() + '" '
    connection.query("SELECT `Note Author`,count(*) as `Number of notes` FROM test.`student report` WHERE  "+dateFilter+"group by `Note Author`,`Author ID`", function (error, raisedCount, fields) {
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
            console.error(error);
        } else {
            var rows = raisedCount;
            var totalCount = 0;
            rows.forEach(selectedRow => {
                totalCount += parseInt(selectedRow['Number of notes'])
            })
            var username = req.session.user.email;
            var firstName = req.session.user.firstName;
            if (rows.length > 0) {
                res.render('report_viewer.ejs', {
                    title: 'Notes report',
                    rows: rows,
                    message: "success",
                    total: { "label": "Total notes count:", "count": totalCount },
                    username: username,
                    firstName: firstName,
                    currentReport: 'notes',
                    isMeetingsReport: false,
                    rangeStartDate:req.body.fromDate,
                    rangeEndDate:req.body.toDate
                });
            } else {
                res.render('report_viewer.ejs', {
                    title: 'Notes report',
                    message: "dataNotFound",
                    username: username,
                    firstName: firstName
                });
            }
            // res.send(rows);
        }
        console.log("Inside Flag report")
    })
}
module.exports = api