const mongoose = require('mongoose')
const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please add the your name"]
        },
        avatar:{
            type:String,
            required:[true,"Please add the your avatar"]
        },
        email:{
            type:String,
            required:[true,"Please add the your email"],
            unique:[true,"This email is already registered"]
        },
        password:{
            type:String,
            required:[true,"Password can't be empty"]
        }
    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model("User",userSchema)