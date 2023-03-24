const express = require('express')
const {body, validationResult} = require('express-validator')
const {registerUser, loginUser, currentUser}  = require('../controller/userController.js')
const ValidateToken = require('../middleware/ValidateToken.js')
const router = express.Router()

const VALIDATING = [body('email').isEmail(),body('password').isLength({ min: 5 })]

router.post("/register",VALIDATING,registerUser);

router.post("/login",VALIDATING,loginUser)

router.get("/current",ValidateToken,currentUser)
module.exports = router