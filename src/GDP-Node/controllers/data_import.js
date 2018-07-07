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
    host: 'localhost',
    user: 'root',
    password: '',
    database:'test'
};
var connection = sql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

router.get('/', (req, res, next) => {
    res.render('data_import.ejs', {
        title: 'Import data'
    })
})
router.post('/',(req,res,next)=>{
        connection.getConnection(function (error, instconn) {
        if (!!error) {
            // instconn.release();
            console.log("Problem in connecting database");
            console.log(error);
        } else {
            console.log("database import database connection successful");
            // instconn.query("SELECT * FROM imported_files", function (error, rows, fields) {
            instconn.query("INSERT INTO `upload_status` (`FLAG`, `TIMESTAMP`) VALUES ('pending', CURRENT_TIMESTAMP)", function (error, tables, fields) {    
                if (!!error) {
                        console.log('Error connecting to');
                        console.error(error);
                    }
                    else{
                        console.log(error)
                    }
                })
            }
            })

      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          var f = files[Object.keys(files)[0]];
    //       var workbook = XLSX.readFile(f.path);
        var wb2 = XLSX.readFile(f.path, {
            type:"file",
            // parseDates:true,
            dateNF: 'yyyy-mm-dd',
            cellDates: true,
            cellNF:true,
            cellText:true
            // cellStyles: true
        })
    //       /* DO SOMETHING WITH workbook HERE */
        var queries =[]
    //   var updateQ = "INSERT INTO `upload_status` (`FLAG`, `TIMESTAMP`) VALUES ('success', CURRENT_TIMESTAMP)";
        queries = SheetJSSQL.book_to_sql(wb2, "MYSQL");
        // queries = SheetJSSQL.book_to_sql(wb2,"MYSQL",{raw:true});
        console.log(queries);
        queries.push("UPDATE `upload_status` SET `flag` = 'success' WHERE ID = (SELECT ID FROM (SELECT * FROM `upload_status`) AS ph WHERE FLAG='pending' ORDER BY ID DESC LIMIT 1)");
        // var updateQ = "UPDATE `upload_status` SET `flag` = 'success' WHERE ID = (SELECT ID FROM (SELECT * FROM `upload_status`) AS ph WHERE FLAG='pending' ORDER BY ID DESC LIMIT 1)";
                // res.status(400).send(queries)
                // res.status(400).send(queries[queries.length-1])
                (async () => {
                        /* Import XLSX to table */
                        const conn2 = await mysql.createConnection(Object.assign({}, opts));
                    for (i = 0; i < queries.length; ++i) await conn2.query(queries[i]);
                    // await conn2.query(updateQ);
                    await conn2.close();
                    })();
      });
      res.redirect('/')
})
  module.exports = router