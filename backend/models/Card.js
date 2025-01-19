const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    list:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'List',
        required: true
    },
    title: {
       type: String,
       required: true,
   },
   description: {
       type: String
   },
   file: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'filesBucket.files'
   },
    created: {
       type: Date,
        default: Date.now,
        required: true
    },
    lastModified: {
       type: Date,
        default: Date.now,
        required: true
    }

});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;