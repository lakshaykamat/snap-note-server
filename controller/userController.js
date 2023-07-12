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
const getAllNotes = tryCatch(asyncHandler(async (req, res) => {
    const {id} = req.params
    const notes = await Notes.find({folderId:id})
    res.json(notes)
}))

const createFolder = tryCatch(asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const createdFolder = await Folder.create({name,user_id:req.user.id});
        res.status(201).json(createdFolder);
      } catch (error) {
        res.status(500).json({ error:error.message });
      }

}))

const getFolder = tryCatch(asyncHandler(async (req, res) => {
    const {id} = req.params
    const folder = await Folder.findById(id)
    res.json(folder)
}))

const updateFolder = tryCatch(asyncHandler(async (req, res) => {
    
}))

const deleteFolder = tryCatch(asyncHandler(async (req, res) => {
    const {id} = req.params
    const del = await Folder.findByIdAndDelete(id)
    await Notes.deleteMany({folderId:id})
    if(!del){
        return res.json({message:"Folder not found"})
    }
    return res.json({message:"Folder Deleted"})
}))

module.exports = { 
    getAllUser,
    getUser
}