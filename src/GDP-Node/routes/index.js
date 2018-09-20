const express = require('express');
const router = express.Router()
const XLSX = require('xlsx');
const formidable = require('formidable');
console.log('inside routes')
router.use('/login',require('../controllers/login.js'))
router.use('/import', require('../controllers/data_import.js'))
router.use('/clearDB',require('../controllers/database_clear.js'))
router.use('/', require('../controllers/data_export.js'))
var session = require('session');
var passport =require('passport');
router.get('/login',function(req,res){
    res.render('login', { title:'Login'});
});
router.post('/login',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}));

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