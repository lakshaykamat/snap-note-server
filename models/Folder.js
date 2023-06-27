const mongoose = require('mongoose');
const Notes = require('./Notes');

const Folder = new mongoose.Schema({
    name: {
        type: String,
        default: 'New Folder'
    },
    parentId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder' 
    },
    notes:{
        type:mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Folder', Folder);
