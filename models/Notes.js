const mongoose = require('mongoose');

const Notes = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    folderId: {
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
        type: Array,
        default:null
    },
    tags: {
        type: Array,
        required: [true, "Tags is required"]
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("Notes", Notes)