const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');
const Notes = require("../models/Notes");
const Folder = require("../models/Folder");
const getAllNotes = tryCatch(asyncHandler(async (req, res) => {
    let query = {};

    if (req.query) {
        query = req.query;
    }

    const notes = await Notes.find(query).sort({ createdAt: -1 }).exec();

    res.status(200).json(notes);
}));

const getAllTags = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find()
    const tagsArray = []
    notes.forEach(note => {
        tagsArray.push(...note.tags);
    });
    const un = [...new Set(tagsArray)];
    res.status(200).json(un)
}))

const getAllPublicNotesofUser = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find({ isPrivate: false ,user_id:{$ne:req.user.id}}).sort({ createdAt: -1 }) // Sort by the 'createdAt' field in descending order
    .exec();

    //Not Include own public notes in own feed
    //const newArray = notes.filter(obj => obj.user_id.toString() !== req.user.id);

    res.status(200).json(notes)
}))

const getAllPrivateNote = tryCatch(asyncHandler(async (req, res) => {
    const notes = await Notes.find({ user_id: req.user.id,isPrivate:true })
    res.status(200).json(notes)
}))

const getPublicNotesofPerson = tryCatch(asyncHandler(async (req, res) => {
    const userid = req.params.userid
    const notes = await Notes.find({ user_id: userid, isPrivate: false })
    res.status(200).json(notes)
}))
const changeVisibility = tryCatch(asyncHandler(async (req, res) => {
    const id = req.params.id
    const note = await Notes.findById(id)
    if (!note) {
        throw new Error("Note not found")
    }

    if (req.user.id !== note.user_id.toString()) throw new Error("Something went wrong.")

    const visibility = note.isPrivate
    await Notes.findByIdAndUpdate(id, { isPrivate: !visibility }, { new: true })
    res.status(200).json({ message: `Note is now ${visibility ? "public" : "private"}` })
}))
const createNote = tryCatch(asyncHandler(async (req, res) => {
    const { title, content, folderId, tags, likes } = req.body;
    const folder = await Folder.findById(folderId);


    if (folder) {

        if (req.user.id !== folder.user_id.toString()) throw new Error("Something went wrong.")

        //New Note of Folder
        const newNote = await Notes.create({ title, content, folderId, likes, tags, user_id: req.user.id })

        return res.status(201).json(newNote);
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

    /*
        Anothor user is trying to edit other user note
    */
    //if (req.user.id !== note.user_id.toString()) throw new Error("Something went wrong.")

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

    if (req.user.id !== note.user_id.toString()) throw new Error("Something went wrong.")

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

    if (note.isPrivate && req.user.id !== note.user_id.toString()) throw new Error("Something went wrong.")

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
            ],
            isPrivate:false
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
    getPublicNotesofPerson,
    changeVisibility,
    getAllPublicNotesofUser,
    getAllPrivateNote,
    getAllTags
}