const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.get('/', isAuthenticated, async (req, res) => {
    res.render('index');
});
router.get('/login',  async (req, res) => {
    res.render('login');
});
module.exports = router;