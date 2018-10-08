const express = require('express')
const router = express.Router()
console.log("Inside controllers/manage.js")
router.get('/', (req, res, next) => {
    var username   = req.session.user.username;
    var firstName  = req.session.user.firstName;
    res.render('manage.ejs', {
        title: 'Manage',username: username, firstName: firstName
    })
})

module.exports = router