const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');
const notesModel = require("../models/notesModel");
const getAllNotes = tryCatch(asyncHandler(async (req, res) => {
    const notes = await notesModel.find({ user_id: req.user.id })
    res.json(notes)
}))

const createNote = tryCatch(asyncHandler(async (req, res) => {
    const { title, body, tags } = req.body
    const creating = await notesModel.create({
        title, body, tags, user_id: req.user.id
    })
    res.status(201).json(creating)
}))

const updateNote = tryCatch(asyncHandler(async (req, res) => {
    const { title, body, tags } = req.body
    const note = await notesModel.findById(req.params.id)
    if (!note) {
        throw new Error("Note not found")
    }
    if (note.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("Forbidden")
    }
    const updatedNote = await notesModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updatedNote)
}))

const deleteNote = tryCatch(asyncHandler(async (req, res) => {
    const note = await notesModel.findById(req.params.id);
    if (!note) {
        res.status(404)
        throw new Error("Note not found")
    }
    if (note.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("Forbidden")
    }
    await notesModel.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json(note)

}))
const deleteAllNote = tryCatch(asyncHandler(async (req, res) => {
    const notes = await notesModel.find({ user_id: req.user.id })
    console.log({ notes })
    const a = await notesModel.deleteMany({ user_id: req.user.id })
    res.json({ message: a })

}))

const getNote = tryCatch(asyncHandler(async (req, res) => {
    const note = await notesModel.findById(req.params.id)
    if (!note) {
        res.status(404)
        throw new Error("Note not Found")
    }
    res.status(200).json(note)
}))
const searchNote = tryCatch(asyncHandler(async (req, res) => {
    const KEY = req.params.key

    if(KEY){
        const data = await notesModel.find(
            {
                user_id: req.user.id,
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
module.exports = { getAllNotes, createNote, updateNote, deleteNote, getNote, deleteAllNote, searchNote }