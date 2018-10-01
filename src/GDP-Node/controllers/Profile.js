const express = require('express')
const router = express.Router()
console.log("Inside controllers/profile.js")
router.get('/', (req, res, next) => {
    res.render('profile.ejs', {
        title: 'Profile'
    })
})

module.exports = router