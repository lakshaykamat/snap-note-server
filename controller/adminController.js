const Admin = require("../models/Admin");
const { tryCatch } = require("../utils/tryCatch");
const asyncHandler = require('express-async-handler');


const getAllAdmin = tryCatch(asyncHandler(async (req, res) => {
    const users = await Admin.find()
    res.json(users)

}))


module.exports = {
    getAllAdmin
}