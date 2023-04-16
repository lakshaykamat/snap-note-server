const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const userModel = require('../models/userModel')
const errorHandler = require('../middleware/errorHandler')
const { tryCatch } = require('../utils/tryCatch')


const registerUser = tryCatch(asyncHandler(async (req, res) => {
    //getting request body
    const { name, email, password, avatar } = req.body
    //checking validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    //checking same email is registered or not
    if (await userModel.findOne({ email: email })) {
        throw new Error("User already registered")
    }

    //Hashing password if this is new user
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({ name, avatar, email, password: hash })
    if (!user) {
        throw new Error("Something went wrong")
    }

    const accessToken = jwt.sign({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        },
    }, process.env.ACCESS_TOKEN_SECERT)
    res.json({ accessToken })

}))


const loginUser = tryCatch(asyncHandler(async (req, res) => {
    // getting request body
    const { email, password } = req.body
    //checking validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    //Check this user exists or not
    const user = await userModel.findOne({ email: email })
    //checking if user not exits and password is correct generates token
    if (user && await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
        }, process.env.ACCESS_TOKEN_SECERT)
        res.json({ accessToken })
    } else {
        throw new Error("Invalid values")
    }
}))
const editUser = tryCatch(asyncHandler(async (req, res) => {
    //Getting avatar input from body
    let {name,avatar}= req.body

    //existed user
    const user = req.user

    if(!name){
        name = user.name
    }
    if(!avatar){
        avatar = user.avatar
    }

    //checking validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    //overriding the user avatar property
    Object.assign(user, {name,avatar});

    //updating the user
    const UPDATEDuser = await userModel.findByIdAndUpdate(req.user.id, user,)
    //Giving the updated access token
    if(UPDATEDuser){
        const accessToken = jwt.sign({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
        }, process.env.ACCESS_TOKEN_SECERT)
        res.json({ accessToken })
    }else{
        res.status(500).json({message:"Something"})
    }

}))
const currentUser = tryCatch(asyncHandler(async (req, res) => {
    res.json(req.user);

}))

const allUser = tryCatch(asyncHandler(async (req, res) => {
    let users = await userModel.find()
    res.json(users)

}))
module.exports = { registerUser, loginUser, currentUser, editUser, allUser }