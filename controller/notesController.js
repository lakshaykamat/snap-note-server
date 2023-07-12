const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');
const Notes = require("../models/Notes");
const Folder = require("../models/Folder");
const getAllNotes = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find()
    res.status(200).json(notes)
}))

const getAllPublicNotes = tryCatch(asyncHandler(async (req,res)=>{
    const notes = await Notes.find({isPrivate:false})

    //Not Include own public notes in own feed
    //const newArray = notes.filter(obj => obj.user_id.toString() !== req.user.id);

    res.status(200).json(notes)
}))

const getAllUserNotes = tryCatch(asyncHandler(async (req,res)=>{
    const notes = await Notes.find({user_id:req.user.id})
    res.status(200).json(notes)
}))

const changeVisibility = tryCatch(asyncHandler(async (req,res)=>{
    const  id  = req.params.id
    const note = await Notes.findById(id)
    if(!note){
        throw new Error("Note not found")
    }
    const visibility = note.isPrivate
    await Notes.findByIdAndUpdate(id,{isPrivate:!visibility},{new:true})
    res.status(200).json({message:"Changed Visibity to " + !visibility})
}))
const createNote = tryCatch(asyncHandler(async (req, res) => {
    const { title, content,folderId,tags,author,likes} = req.body;
    const folder = await Folder.findById(folderId);
    if (folder) {
        //Existing notes of folder
        const existingNotes = await Notes.find({folderId:folder.id})
        console.log(existingNotes);
        //New Note of Folder
        const newNote = await Notes.create({ title, content, folderId,tags ,likes,author,user_id:req.user.id})
        console.log(newNote);

        //Updating Folder (adding new note)
         let updatedNote = existingNotes ? [...existingNotes,newNote] : newNote
        console.log(updateNote);
        await Folder.findByIdAndUpdate({_id:folderId},{notes:updatedNote});


        return  res.status(201).json({note:newNote,message:"Folder updated successfully"});
    } else {
        return res.status(404).json({ message: 'Folder not found' });
    }
}))

const updateNote = tryCatch(asyncHandler(async (req, res) => {
    const note = await Notes.findById(req.params.id)
    if (!note) {
        throw new Error("Note not found")
    }
    const updatedNote = await Notes.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    const existingNotesOfFolder = await Folder.findById(note.folderId)
    const replace = existingNotesOfFolder.notes.map((item)=>{
        if(item._id === req.params.id){
            return updatedNote
        }
        return item
    })
    const folder = await Folder.findByIdAndUpdate({_id:note.folderId},{notes: replace});
    res.status(200).json({
        folder,
        existingNotesOfFolder,
        updateNote
    })
}))

const deleteNote = tryCatch(asyncHandler(async (req, res) => {
    const note = await Notes.findById(req.params.id);
    if (!note) {
        res.status(404)
        throw new Error("Note not found")
    }
    await Notes.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json(note)

}))
const deleteAllNote = tryCatch(asyncHandler(async (req, res) => {
    const allNotes = await Notes.deleteMany()
    res.json({ allNotes })
}))

const getNote = tryCatch(asyncHandler(async (req, res) => {
    const note = await Notes.findById(req.params.id)
    if (!note) {
        res.status(404)
        throw new Error("Note not Found")
    }
    res.status(200).json(note)
}))
const searchNote = tryCatch(asyncHandler(async (req, res) => {
    const KEY = req.params.key
    if (KEY) {
        const data = await Notes.find(
            {
                "$or": [
                    { "title": { $regex: KEY } },
                    { "content": { $regex: KEY } },
                    { "tags": { $regex: KEY } }
                ]
            }
        )
        res.json(data)
    }

}))

module.exports = { 
    getAllNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    deleteAllNote,
    searchNote,
    changeVisibility,
    getAllPublicNotes,
    getAllUserNotes
}