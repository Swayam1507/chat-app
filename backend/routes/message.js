const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const Conversation = require('../models/conversation');
const Message = require('../models/message')
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/create', authMiddleware, async (req, res) => {
    let { content, conversation } = req.body;
    try {
        let newMessage = await Message.create({
            conversation,
            content,
            sender: req.user.userId,
            date: Date.now()
        })
        // update latestMessage in conversations
        const newMessageId = new ObjectId(newMessage._id);
        let newConversation = await Conversation.findByIdAndUpdate(conversation, { latestMessage: newMessageId })
        res.send({ newMessage })
    } catch (error) {
        res.send(error)
    }
})

router.post('/getMessages', async (req, res) => {
    let { conversationId } = req.body;
    try {
        let allMessages = await Message.find({
            conversation: conversationId
        }).populate('readBy.user','-password')
        res.send({ allMessages })
    } catch (error) {
        res.send({ error })
    }
})

router.post('/read-message', authMiddleware, async (req, res) => {
    let { msgIds } = req.body;
    try {
        //   let messages = await Message.updateMany(
        //     { _id: { $in: msgIds } },
        //     { $push: { readBy: req.user.userId } }
        //   );
        // console.log('in read message',req.user.userId)
        let messages = await Message.updateMany(
            { _id: { $in: msgIds } },
            // { readBy:{ $push: { user: req.user.userId, time: new Date() } } },
            { $push: { readBy: { user: req.user.userId, time: Date.now()} } },
        {new:true, multi:true}
      );
      res.send({ messages });
    } catch (error) {
      res.send({ error });
    }
  });
  
module.exports = router;