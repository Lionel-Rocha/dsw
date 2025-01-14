const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    backgroundColor: {
        type: String,
        default: '#b4d7e3',
    },
    fontColor: {
        type: String,
        default: '#7fb3d5',
    }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
