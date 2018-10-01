const express = require('express')
const router = express.Router()
console.log("Inside controllers/home.js")
router.get('/', (req, res, next) => {
    res.render('home.ejs', {
        title: 'Home'
    })
})

module.exports = router