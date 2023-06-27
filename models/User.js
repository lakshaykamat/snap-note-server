const mongoose = require('mongoose')
const User = mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Name is required"]
        },
        avatar:{
            type:String,
            required:[true,"Avatar is required"]
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:[true,"Invalid email (already in use)"]
        },
        googleId:{
            type:String,
            required:[true,"GoogleId can't be empty"]
        }
    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model("User",User)