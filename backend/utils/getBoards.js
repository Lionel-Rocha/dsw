const mongoose = require('mongoose');
const BoardPermission = require('../models/BoardPermissions');
const Board = require('../models/Board');

async function getUserBoards(userId) {
    try{
        const objectIdUser = new mongoose.Types.ObjectId(userId);

        const permissions = await BoardPermission.find({
            userId: objectIdUser,
            role: { $in: ['admin', 'member'] }
        }).populate('boardId');

        return permissions.map(permission => permission.boardId);
    } catch (error) {
        return error;
    }
}

module.exports = getUserBoards;