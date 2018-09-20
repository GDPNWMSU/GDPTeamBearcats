const express = require('express')
const router = express.Router()
var session = require('session');
var passport =require('passport');
// router.get('/login',function(req,res){
//     res.render('login', { title:'Login'});
// });

router.get('/', (req, res, next) => {
    res.render('login.ejs', {
        title: 'Login'
    })
})

router.post('/',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}));
module.exports = router