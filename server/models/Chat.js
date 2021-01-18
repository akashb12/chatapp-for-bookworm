const mongoose = require('mongoose');
const chatSchema = mongoose.Schema({
    ids: {
        type: Array
    },
    messages: {
        type: Array
    },
    chatWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chatStartedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });


const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat }