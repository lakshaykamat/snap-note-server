const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');
const Notes = require("../models/Notes");
const getAllNotes = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find({_id:req.user._id})
    res.status(200).json(notes)
}))


const createNote = tryCatch(asyncHandler(async (req, res) => {
    const { title, content, parentId, tags } = req.body;
    const folder = await Folder.findById(parentId);
    if (folder) {
        const newNote = await Notes.create({ title, content, parentId, tags })
        return res.json(newNote);
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
    res.status(200).json(updatedNote)
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
                    { "body": { $regex: KEY } },
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
    allTags
}