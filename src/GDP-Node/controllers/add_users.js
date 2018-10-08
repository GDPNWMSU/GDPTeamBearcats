const express = require('express')
const router = express.Router()
console.log("Inside controllers/add_user.js")
router.get('/', (req, res, next) => {
    var username   = req.session.user.username;
    var firstName  = req.session.user.firstName;
    res.render('add_users.ejs', {
        title: 'add_users',username: username, firstName: firstName
    })
}) 

console.log("i am in the add_user.js file")

module.exports = router