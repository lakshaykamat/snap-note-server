const express = require("express");
const User = require("../../models/User");
const Admin = require("../../models/Admin");
const Notes = require("../../models/Notes");
const Folder = require("../../models/Folder");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  const admins = await Admin.find();
  res.render("users", { users, admins });
});

router.get("/:userid", async (req, res) => {
  const userid = req.params.userid;
  const user = await User.findById(userid)
  const admin = await Admin.findById(userid)
  let obj = {
    user:user,
    role:undefined
  }

  user ? obj = {user:user,role:"User"} : obj = {user:admin,role:"Admin"} 

  const notes = await Notes.find({user_id:userid})
  const folders = await Folder.find({user_id:userid})
  res.render("user",{...obj,notes,folders})
});

function truncateHtml(html, limit) {
  const truncated = html.slice(0, limit);
  return truncated + (html.length > limit ? '...' : '');
}

module.exports = router;