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

//[ ] Add authentication in this route
//[ ] Remvove past jwt authentication system
router.route('/').get(getAllFolder).post(createFolder)
router.route('/all/notes/:id').get(getAllNotes)
router.route('/all/').get(getAllFolder)
router.route('/:id').get(getFolder).put(updateFolder).delete(deleteFolder)
module.exports = router