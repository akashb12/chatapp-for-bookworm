const express = require('express');
const router = express.Router();
const { Chat } = require("../models/Chat");


router.post("/getChats", async (req, res) => {
    await Chat.find({ "ids": { "$all": req.body } })
        .populate("sender")
        .exec((err, chats) => {
            if (err) return res.status(400).send(err);
            res.status(200).send({
                chats
            })
        })
});

module.exports = router;