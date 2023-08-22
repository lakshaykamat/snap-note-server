const express = require('express');
const { tryCatch } = require('../../utils/tryCatch');
const asyncHandler = require('express-async-handler');
const router = express.Router();


router.get('/', tryCatch(asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login')
    res.render('index', { isLoggedIn: true })
})));


router.get('/login', tryCatch(asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('login', { isLoggedIn: true })
    } else {
        res.render('login'), { isLoggedIn: false };
    }
})));

router.get('/register', tryCatch(asyncHandler(async (req, res) => {
    const {message} = req.query
    res.render('register',{data:message});
})));
module.exports = router;