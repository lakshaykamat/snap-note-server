const express = require('express')
const router = express.Router()
const {
    getAllAdmin
} = require('../controller/adminController')
router.route('/all').get(getAllAdmin)
// router.route('/:id').get(getUser).delete(deleteUser).put(updateUser)
module.exports = router