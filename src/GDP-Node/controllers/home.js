const express = require('express')
const router = express.Router()
console.log("Inside controllers/home.js")
router.get('/', (req, res, next) => {
    var username   = req.session.user.email;
    var firstName  = req.session.user.firstName;
    var lastName  =  req.session.user.lastName;
    res.render('home.ejs', {
        title: 'Home',username: username, firstName: firstName, lastName: "lastName"
    })
})

module.exports = router