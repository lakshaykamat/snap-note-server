const asyncHanlder = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const userModel = require('../models/userModel')
const errorHandler = require('../middleware/errorHandler')
const { tryCatch } = require('../utils/tryCatch')


const registerUser = tryCatch(asyncHanlder(async (req, res) => {
    //getting request body
    const { name, email, password } = req.body
    //checking validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    //cheking same email is registered or not
    if (await userModel.findOne({ email: email })) {
        throw new Error("User already registered")
    }
    //Hashing password if this is new user
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({ name, email, password: hash })
    if (!user) {
        throw new Error("Something went wrong")
    }
    return res.status(200).json(user)
}))


const loginUser = tryCatch(asyncHanlder(async (req, res) => {
    // getting request body
    const {email, password } = req.body
    //checking validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    //Check this user exists or not
    const user = await userModel.findOne({email:email})
    //checking if user not exits and password is corrent generates token
    if(user && await bcrypt.compare(password,user.password)){
        const accessToken = jwt.sign({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },     
        },process.env.ACCESS_TOKEN_SECERT,{ expiresIn: "30m" })
        res.json({accessToken})
    }else{
        throw new Error("Invalid values")
    }
}))

const currentUser = tryCatch(asyncHanlder(async(req,res)=>{
    res.json(req.user);
}))
module.exports = { registerUser, loginUser ,currentUser}