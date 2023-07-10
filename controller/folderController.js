const Folder = require("../models/Folder");
const Notes = require("../models/Notes");
const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');


const getAllFolder = tryCatch(asyncHandler(async (req, res) => {
    //const newFolder = await Folder.find({user_id: req.user.id});

    const newFolder = await Folder.find({user_id: req.user.id}).sort({ createdAt: -1 }).exec() .then((documents) => {
        // Use the sorted documents
        res.json(documents)
      })
      .catch((err) => {
        // Handle error
      });
      
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
    getAllFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolder,
    getAllNotes
}