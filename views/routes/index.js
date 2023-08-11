const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.get('/', isAuthenticated, async (req, res) => {
    res.render('index');
});

module.exports = router;