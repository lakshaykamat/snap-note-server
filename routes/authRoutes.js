const express = require('express')
const isAuthenticated  = require('../middleware/isAuthenticated')
const passport = require('passport')
const router = express.Router()
const errorHandler = require('../middleware/errorHandler')



router.route('/google').get((req, res) => {
    passport.authenticate('google', { scope: ['email', 'profile'] })
})

router.route('/google/callback').get((req, res) => {
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL + '/home',
        failureRedirect: process.env.CLIENT_URL + "/failed"
    })
})

router.route('/getuser').get( isAuthenticated, (req, res) => {
    res.status(200).json(req.user)
})

router.route('/login').post(passport.authenticate('local', {
    failureRedirect: '/fail',
    successRedirect: '/'
}))

router.route('/register').post(errorHandler, async (req, res, next) => {
    const { username, password, email } = req.body;
    try {
        const user = await Admin.findOne({ email, username })
        if (user) {
            res.status(400)
            throw new Error("User already exists")
        } else {
            const hash = await bcrypt.hash(password, 10)
            const user = { username, password: hash, email }
            const newUser = await Admin.create(user)
            return res.status(201).json(newUser)
        }
    } catch (error) {
        return next(error)
    }
    // Check if a user with the same username or email already exists


})

router.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/login');
})
module.exports = router