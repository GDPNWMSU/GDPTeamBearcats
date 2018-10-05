const express = require('express')
const router = express.Router()
console.log("Inside controllers/profile.js")
router.get('/', (req, res, next) => {
    var username   = req.session.user.username;
    var firstName  = req.session.user.firstName;
    res.render('profile.ejs', {
        title: 'profile',username: username, firstName: firstName
    })
})

module.exports = router