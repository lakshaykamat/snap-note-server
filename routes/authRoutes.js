const express = require('express')
const { isAuthenticated } = require('../middleware/isAuthenticated')
const passport = require('passport')
const router = express.Router()



router.route('/google').get((req, res) => {
    passport.authenticate('google', { scope: ['email', 'profile'] })
})

router.route('/google/callback').get((req, res) => {
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL + '/home',
        failureRedirect: process.env.CLIENT_URL + "/failed"
    })
})

module.exports = router