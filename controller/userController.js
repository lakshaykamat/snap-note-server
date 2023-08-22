const Notes = require("../models/Notes");
const Folder = require("../models/Folder");
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
    if(req.user.id !== existingUser._id.toString()) throw new Error("Something went wrong.")
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true })
    res.json({success:true,value:user})

}))

const deleteAllData = tryCatch(asyncHandler(async (req, res) => {
    await Notes.deleteMany({user_id:req.user.id})
    await Folder.deleteMany({user_id:req.user.id})
    res.status(200).json({success:true})
}))


module.exports = {
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    deleteAllData
}