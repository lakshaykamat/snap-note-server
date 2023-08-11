const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.get('/', isAuthenticated, async (req, res) => {
    const user = req.user
    console.log(user)
    res.render('profile',{user});
})

module.exports = router;