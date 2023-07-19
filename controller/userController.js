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

const deleteUser = tryCatch(asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)
    res.json(user)

}))


const updateUser = tryCatch(asyncHandler(async (req, res) => {
    const existingUser = await User.findById(req.params.id)
    if (!existingUser) throw new Error("Invalid User")
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true })
    res.json({success:true,value:user})

}))


module.exports = {
    getAllUser,
    getUser,
    deleteUser,
    updateUser
}