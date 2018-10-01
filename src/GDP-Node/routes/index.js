const express = require('express');
const router = express.Router()
const XLSX = require('xlsx');
const formidable = require('formidable');
console.log('Inside routes/index')
router.use('/',require('../controllers/home.js'))
router.use('/login',require('../controllers/login.js'))
router.use('/profile',require('../controllers/profile.js'))
router.use('/import', require('../controllers/data_import.js'))
router.use('/clearDB',require('../controllers/database_clear.js'))
router.use('/view', require('../controllers/data_export.js'))
router.use('/export',require('../controllers/report_export.js'))
router.use('/report',require('../controllers/report_export.js'))
router.use('*', (req, res, next) => {
    res.render('../views/404.ejs', {
        title: 'Page not found'
    })
})
// router.post('/import', (req, res, next) => {
//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//         var f = files[Object.keys(files)[0]];
//         var workbook = XLSX.readFile(f.path);
//         /* DO SOMETHING WITH workbook HERE */
//         // res.send({status:400,message:'File imported'})
//         res.status(400).send(workbook.Sheets);
//     });
// })


module.exports = router