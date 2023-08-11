const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const User = require('../../models/User');
const Admin = require('../../models/Admin');
const router = express.Router();


router.get('/', isAuthenticated, async (req, res) => {
    const users = await User.find()
    const admins = await Admin.find()
    res.render('users', { users,admins });
});

module.exports = router;