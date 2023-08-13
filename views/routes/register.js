const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.get('/', async (req, res) => {
    const data = req.query;
    res.render('register',{data:data.message});
});
module.exports = router;