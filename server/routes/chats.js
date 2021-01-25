const express = require('express');
const router = express.Router();
const { Chat } = require("../models/Chat");


router.post("/getChats", async (req, res) => {
    await Chat.find({ "ids": { "$all": req.body }, "chatStartedBy": req.body[0] })
        .populate("chatWith")
        .exec((err, chats) => {
            if (err) return res.status(400).send(err);
            else if (chats.length === 0) {
                Chat.find({ "ids": { "$all": req.body }, "chatWith": req.body[0] })
                    .populate("chatStartedBy")
                    .exec((err, chats) => {
                        if (err) return res.status(400).send(err);
                        res.status(200).send({
                            chats
                        })
                    })
            }
            else {
                res.status(200).send({
                    chats
                })
            }
        })
});
// get ids
router.post("/getIds", async (req, res) => {
    await Chat.find({ "ids": { "$all": req.body.userId } })
        .exec((err, chats) => {
            if (err) return res.status(400).send(err);
            res.status(200).send({
                chats
            })
        })
});
// get all chats
router.post("/allChats", async (req, res) => {
    let allChats = []
    console.log("body", req.body)
    await Chat.find({ "ids": { "$in": req.body.ids }, "chatStartedBy": req.body.userId })
        .populate("chatWith")
        .exec((err, chat1) => {
            if (err) return res.status(400).send(err);
            Chat.find({ "ids": { "$in": req.body.ids }, "chatWith": req.body.userId })
                .populate("chatStartedBy")
                .exec(async (err, chat2) => {
                    if (err) return res.status(400).send(err);
                    const run = async () => {
                        return Promise.all(chat1.map(async (item) => {
                            allChats.push(item)
                        }));
                    }
                    const run1 = async () => {
                        return Promise.all(chat2.map(async (item) => {
                            allChats.push(item)
                        }));
                    }
                    await run();
                    await run1()
                    res.status(200).send({
                        allChats
                    })
                })
        })
});

// seen
router.post("/seen", async (req, res) => {
    Chat.findOneAndUpdate(
        { "ids": { "$all": req.body }, "messages.seen": false },
        {
            $set: {
                "messages.$[].seen": true
            }
        },
        { new: true },
        (err, user) => {
            console.log(user)
            if (err) return res.status(400).json({ status: false, err });
            return res.status(200).json({
                status: true,
                message: "message seen",
            });
        }
    );
});

module.exports = router;