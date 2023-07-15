const User = require("../models/User");
const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');


const getAllUser = tryCatch(asyncHandler(async (req, res) => {

    const users = await User.find()
    res.json(users)
      
}))

const getUser = tryCatch(asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)
    res.json(user)
      
}))


module.exports = { 
    getAllUser,
    getUser
}