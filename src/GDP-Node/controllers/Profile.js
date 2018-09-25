const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('Profile.ejs', {
        title: 'Profile'
    })
})

module.exports = router