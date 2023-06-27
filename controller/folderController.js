const Folder = require("../models/Folder");
const Notes = require("../models/Notes");
const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');


const getAllFolder = tryCatch(asyncHandler(async (req, res) => {
    const newFolder = await Folder.find();
    res.json(newFolder);
}))
const getAllNotes = tryCatch(asyncHandler(async (req, res) => {
    const {id} = req.params
    const notes = await Notes.find({parentId:id})
    res.json(notes)
}))

const createFolder = tryCatch(asyncHandler(async (req, res) => {
    const {name} = req.body;
    const newFolder = await Folder.create({name});
    res.json(newFolder);

}))

const getFolder = tryCatch(asyncHandler(async (req, res) => {
    
}))

const updateFolder = tryCatch(asyncHandler(async (req, res) => {
    
}))

const deleteFolder = tryCatch(asyncHandler(async (req, res) => {

}))

module.exports = { 
    getAllFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolder,
    getAllNotes
}