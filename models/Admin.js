const mongoose = require('mongoose')
const Admin = mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Name is required"]
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:[true,"Invalid email (already in use)"]
        },
        password:{
            type:String,
            required:[true,"Password is required"],
        }
    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model("Admin",Admin)