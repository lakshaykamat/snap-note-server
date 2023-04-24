const express = require('express')
const router = express.Router()
const {getAllNotes, createNote, updateNote, deleteNote,getNote, deleteAllNote,searchNote,getAllNotesByTags,allTags} = require('../controller/notesController')

const ValidateToken = require('../middleware/ValidateToken')

router.use(ValidateToken)
router.route('/').get(getAllNotes).post(createNote).delete(deleteAllNote)
router.route('/tags/all').get(allTags)
router.route('/search/:key').get(searchNote)
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote)
module.exports = router