const express = require('express')
const router = express.Router()
const {getAllNotes, createNote, deleteAllNote, deleteNote, getNote, updateNote, searchNote} = require('../controller/notesController')


router.route('/').get(getAllNotes).post(createNote).delete(deleteAllNote)
// router.route('/tags/all').get(allTags)
router.route('/search/:key').get(searchNote)
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote)
module.exports = router