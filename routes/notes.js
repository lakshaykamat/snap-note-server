const express = require('express')
const router = express.Router()
const {getAllNotes, createNote, getAllUserNotes,getAllPublicNotes,changeVisibility,deleteAllNote, deleteNote, getNote, updateNote, searchNote} = require('../controller/notesController')


router.route('/')
.get(getAllNotes)
.post(createNote)
.delete(deleteAllNote)


router.route('/search/:key')
.get(searchNote)

router.route('/public')
.get(getAllPublicNotes)

router.route('/private')
.get(getAllUserNotes)

router.route('/visibility/:id')
.get(changeVisibility)

router.route('/:id')
.get(getNote)
.put(updateNote)
.delete(deleteNote)
module.exports = router