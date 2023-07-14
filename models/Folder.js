const mongoose = require('mongoose');

const Folder = new mongoose.Schema({
    name: {
        type: String,
        default: 'New Folder',
        unique: [true,"Name already exists."],
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Folder', Folder);
