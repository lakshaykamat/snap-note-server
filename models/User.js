const mongoose = require('mongoose')
const User = mongoose.Schema(
    {
        username:{
            type:String,
            unique:[true,"Invalid username (already in use)"],
            required:[true,"Name is required"]
        },
        avatar:{
            type:String,
            
        },
        bio:{
            type:String,
            maxlength:30,
        },
        password:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:[true,"Invalid email (already in use)"]
        },
        googleId:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model("User",User)