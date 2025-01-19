const mongoose = require('mongoose');

const boardPermissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
    },
});

const BoardPermission = mongoose.model('BoardPermission', boardPermissionSchema);

module.exports = BoardPermission;
