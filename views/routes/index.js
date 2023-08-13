const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.get('/', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login')
    res.render('index', { isLoggedIn: true })
    res.redirect('/login')
});
router.get('/login', async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('login', { isLoggedIn: true })
    } else {
        res.render('login'), { isLoggedIn: false };
    }
});
module.exports = router;