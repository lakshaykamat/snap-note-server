const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.get('/', async (req, res) => {

    if (!req.isAuthenticated()) return res.redirect('/login')

    const user = req.user
    console.log(user)
    res.render('profile', { user, isLoggedIn: true });
})

module.exports = router;