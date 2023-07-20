const express = require('express')
const router = express.Router()
const { getAllNotes, createNote, getAllPrivateNote, getPublicNotesofPerson, getAllPublicNotesofUser, changeVisibility, deleteAllNote, deleteNote, getNote, updateNote, searchNote, getAllTags } = require('../controller/notesController')

router.route('/')
    .get(getAllNotes)
    .post(createNote)
    .delete(deleteAllNote)


router.route('/search/:key')
    .get(searchNote)

//All public notes of logedin user
router.route('/public')
    .get(getAllPublicNotesofUser)


//All notes of logedin user
router.route('/private')
    .get(getAllPrivateNote)

//Public notes of any user
router.route('/user/:userid')
    .get(getPublicNotesofPerson)


router.route('/tags/all')
    .get(getAllTags)

router.route('/visibility/:id')
    .get(changeVisibility)

router.route('/:id')
    .get(getNote)
    .put(updateNote)
    .delete(deleteNote)
module.exports = router