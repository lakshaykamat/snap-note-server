const express = require('express');
const asyncHandler = require('express-async-handler');
const { tryCatch } = require('../../utils/tryCatch');
const router = express.Router();


router.get('/', tryCatch(asyncHandler(async (req, res) => {

    if (!req.isAuthenticated()) return res.redirect('/login')

    res.render('profile', { user:req.user, isLoggedIn: true });
})))

module.exports = router;