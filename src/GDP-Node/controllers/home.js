const express = require('express')
const router = express.Router()
console.log("Inside controllers/home.js")
router.get('/', (req, res, next) => {
    var username   = req.session.user.email;
    var firstName  = req.session.user.firstName;
    res.render('home.ejs', {
        title: 'Home',username: username, firstName: firstName
    })
})

module.exports = router