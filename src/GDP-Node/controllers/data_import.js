var XLSX = require('xlsx');
var assert = require('assert');
var SheetJSSQL = require('./SheetJSSQL');
var mysql = require('mysql2/promise');
var sql = require("mysql");
const express = require('express');
const router = express.Router()
const formidable = require('formidable');
/* Connection options (requires two databases sheetjs and sheetj5) */
var opts = {
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
};
var sqlconnection = sql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
});
var connection = mysql.createPool({
    connectionLimit: 50,
    // connectTimeout: 60 * 60 * 1000,
    // aquireTimeout: 60 * 60 * 1000,
    // timeout: 60 * 60 * 1000,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    dateStrings: true,
    timezone: 'utc'
});
// const getConnection = () => connection.getConnection();
console.log("Inside controllers/data_import.js")
router.get('/', (req, res, next) => {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    res.render('data_import.ejs', {
        title: 'Import data', username: username, firstName: firstName
    })
})
router.post('/', (req, res, next) => {

    var queries = []
    var sheetNames = []
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var f = files[Object.keys(files)[0]];
        //       var workbook = XLSX.readFile(f.path);
        const wb2 = XLSX.readFile(f.path, {
            type: "file",
            // parseDates:true,
            dateNF: 'yyyy-mm-dd',
            cellDates: true,
            cellNF: true,
            cellText: true
            // cellStyles: true
        })
        
        sheetNames = wb2.SheetNames
        for (var i = 0; i < wb2.SheetNames.length; i++) {
            SheetJSSQL
            queries.push(SheetJSSQL.sheet_to_sql(wb2.Sheets[wb2.SheetNames[i]], wb2.SheetNames[i], "MYSQL"));
        }
        console.log("0th query length"+queries[0].length)
        for (var i = 0; i < queries.length; i++) {
            var len = queries[i].length;
            var last = i==queries.length-1;
            var first = i==0;
            (async () => { await util(len,queries[i],sheetNames[i],first,last,i)})();
        }

    });




    res.redirect('/')
})
function util(len,queries,sheetName,first,last,i){
    (async () => {

        if(first){
        await connection.query("INSERT INTO `upload_status`  (`TABLE_NAME`,`FLAG`,`START_TIMESTAMP`) VALUES ('File Upload','pending', CURRENT_TIMESTAMP)")
        }
        await connection.query("INSERT INTO `upload_status`  (`TABLE_NAME`,`FLAG`,`START_TIMESTAMP`) VALUES ('" + sheetName + "','pending', CURRENT_TIMESTAMP)")
        // if (queries[i].length > 2) {
            for (var j = 0; j < len; j++) {
                await connection.query(queries[j]);
            }
        // }
        await connection.query("UPDATE `upload_status`  SET `FLAG`='success' ,  `END_TIMESTAMP` = CURRENT_TIMESTAMP WHERE `TABLE_NAME` = '" + sheetName + "' AND `FLAG` = 'pending' ORDER BY ID DESC LIMIT 1")
        if (last) {
        await connection.query("UPDATE `upload_status` SET `flag` = 'success', `END_TIMESTAMP` = CURRENT_TIMESTAMP WHERE ID = (SELECT ID FROM (SELECT * FROM `upload_status`) AS ph WHERE FLAG='pending' AND `TABLE_NAME` = 'File Upload'  ORDER BY ID DESC LIMIT 1)")
        }
    })();
}
module.exports = router