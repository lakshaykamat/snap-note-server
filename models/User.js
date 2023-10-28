const mongoose = require('mongoose')
const User = mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Name is required"]
        },
        avatar:{
            type:String,
        },
        bio:{
            type:String,
            maxlength:30,
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:[true,"Invalid email (already in use)"]
        },
        googleId:{
            type:String,
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
module.exports = mongoose.model("User",User)