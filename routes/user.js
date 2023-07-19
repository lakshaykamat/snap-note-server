const express = require('express')
const router = express.Router()
const {
    getAllUser,getUser,deleteUser,updateUser
} = require('../controller/userController')
// const ValidateToken = require('../middleware/ValidateToken')

//[ ] Add A in this route
//[ ] Remvove past jwt authentication system
router.route('/all').get(getAllUser)
router.route('/:id').get(getUser).delete(deleteUser).put(updateUser)
module.exports = router