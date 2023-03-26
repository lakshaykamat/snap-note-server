const moongoose = require('mongoose')

const notesSchema = moongoose.Schema({
    user_id: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Please add the title"]
    },
    body: {
        type: String,
    },
    tags: {
        type: Array,
        default: "#general"
    },
}, {
    timestamps: true
})
module.exports = moongoose.model("Notes", notesSchema)