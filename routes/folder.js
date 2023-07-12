const express = require('express')
const router = express.Router()
const {
    getAllFolder,
    getFolder,
    updateFolder,
    deleteFolder,
    createFolder,
    getAllNotes
} = require('../controller/folderController')
// const ValidateToken = require('../middleware/ValidateToken')

//[ ] Add A in this route
//[ ] Remvove past jwt authentication system
router.route('/').get(getAllFolder).post(createFolder)
router.route('/:id').get(getFolder).delete(deleteFolder)
router.route('/all/notes/:id').get(getAllNotes)
module.exports = router