const mongoose = require('mongoose');

const Notes = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    isPrivate: {
        type: Boolean,
        default: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    tags: {
        type: Array,
        required: [true, "Tags is required"]
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("Notes", Notes)