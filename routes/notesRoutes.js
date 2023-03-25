const express = require('express')
const router = express.Router()
const {getAllNotes, createNote, updateNote, deleteNote,getNote} = require('../controller/notesController')

const ValidateToken = require('../middleware/ValidateToken')

router.use(ValidateToken)
router.route('/').get(getAllNotes).post(createNote)
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote)
module.exports = router