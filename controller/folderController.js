const Folder = require("../models/Folder");
const Notes = require("../models/Notes");
const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');


const getAllFolder = tryCatch(asyncHandler(async (req, res) => {
    //const newFolder = await Folder.find({user_id: req.user.id});

    await Folder.find({user_id: req.user.id}).sort({ createdAt: -1 }).exec() .then((documents) => {
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

const getFolder = tryCatch(asyncHandler(async(req, res) => {
    const {id} = req.params
    const folder = await Folder.findById(id)
    if(req.user.id !== folder.user_id.toString()) throw new Error("Something went wrong.")
    res.status(200).json(folder)
}))

const getFolderByName = tryCatch(asyncHandler(async(req, res) => {
    const {name} = req.params
    const folder = await Folder.find({name,user_id:req.user.id})
    if(folder.length > 0){
        const notes = await Notes.find({folderId:folder[0]._id,user_id:req.user.id})
        res.status(200).json({folder,notes})
    }
    res.status(200).json({folder:null,notes:null})
}))


const updateFolder = tryCatch(asyncHandler(async (req, res) => {
    const folder = await Folder.findById(req.params.id)
    if (!folder) {
        throw new Error("Note not found")
    }

    if(req.user.id !== folder.user_id.toString()) throw new Error("Something went wrong.")
    await Folder.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json({
        message:`Folder renamed to ${req.body.name}`
    })
}))

const deleteFolder = tryCatch(asyncHandler(async (req, res) => {
    const {id} = req.params
    const f = await Folder.findById(id)
    if(!f) throw new Error("Folder Not found")

    if(req.user.id !== f.user_id.toString()) throw new Error("Something went wrong.")

    const folder = await Folder.findByIdAndDelete(id)
    await Notes.deleteMany({folderId:id})
    return res.json({message:"Folder Deleted",folder})
}))

module.exports = { 
    getAllFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolder,
    getAllNotes,
    getFolderByName
}