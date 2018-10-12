const express = require('express')
const router = express.Router()
console.log("Inside controllers/add_users.js")
router.get('/', (req, res, next) => {
    var username   = req.session.user.username;
    var firstName  = req.session.user.firstName;
    res.render('add_users.ejs', {
        title: 'add_users'
    })
})


module.exports = router