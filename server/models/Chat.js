const mongoose = require('mongoose');
const chatSchema = mongoose.Schema({
    ids: {
        type: Array
    },
    messages: {
        type: Array
    }
}, { timestamps: true });


const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat }