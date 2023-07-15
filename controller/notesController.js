const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');
const Notes = require("../models/Notes");
const Folder = require("../models/Folder");
const getAllNotes = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find()
    res.status(200).json(notes)
}))

const getAllPublicNotes = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find({ isPrivate: false })

    //Not Include own public notes in own feed
    //const newArray = notes.filter(obj => obj.user_id.toString() !== req.user.id);

    res.status(200).json(notes)
}))

const getAllUserNotes = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find({ user_id: req.user.id })
    res.status(200).json(notes)
}))

const changeVisibility = tryCatch(asyncHandler(async (req, res) => {
    const id = req.params.id
    const note = await Notes.findById(id)
    if (!note) {
        throw new Error("Note not found")
    }
    const visibility = note.isPrivate
    await Notes.findByIdAndUpdate(id, { isPrivate: !visibility }, { new: true })
    res.status(200).json({ message: `Note is now ${visibility ? "public" : "private"}` })
}))
const createNote = tryCatch(asyncHandler(async (req, res) => {
    const { title, content, folderId, tags, likes } = req.body;
    const folder = await Folder.findById(folderId);
    if (folder) {
        //New Note of Folder
        await Notes.create({ title, content, folderId, likes, tags, user_id: req.user.id })

        return res.status(201).json({ message: `New Note Created on ${folder.name}` });
    } else {
        res.status(404)
        throw new Error("Folder Not Found")
    }
}))

const updateNote = tryCatch(asyncHandler(async (req, res) => {
    const note = await Notes.findById(req.params.id)
    if (!note) {
        throw new Error("Note not found")
    }
    await Notes.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(200).json({
        message: "Note Updated!",
        body: req.body
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
                $or: [
                    { title: { $regex: KEY, $options: 'i' } },
                    { content: { $regex: KEY, $options: 'i' } },
                    { tags: { $regex: KEY, $options: 'i' } },
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