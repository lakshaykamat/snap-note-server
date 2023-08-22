const express = require("express");
const User = require("../../models/User");
const Admin = require("../../models/Admin");
const Notes = require("../../models/Notes");
const Folder = require("../../models/Folder");
const { tryCatch } = require("../../utils/tryCatch");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.get("/", tryCatch(asyncHandler(async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    const users = await User.find();
    const admins = await Admin.find();
    res.render("users", { users, admins, isLoggedIn: true });
  } catch (error) {
    // Handle any errors that might occur during the database queries or rendering
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
})));


router.get("/:userid", tryCatch(asyncHandler(async (req, res) => {
  
  if (!req.isAuthenticated()) return res.redirect('/login')

    const userid = req.params.userid;
    const user = await User.findById(userid)
    const admin = await Admin.findById(userid)
    let obj = {
      user: user,
      role: undefined
    }

    user ? obj = { user: user, role: "User" } : obj = { user: admin, role: "Admin" }

    const notes = await Notes.find({ user_id: userid })
    const folders = await Folder.find({ user_id: userid })
    res.render("user", { ...obj, notes, folders, isLoggedIn: true })
})));

module.exports = router;