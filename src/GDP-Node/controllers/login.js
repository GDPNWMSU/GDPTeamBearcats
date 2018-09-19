const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('login.ejs', {
        title: 'Login'
    })
})

module.exports = router