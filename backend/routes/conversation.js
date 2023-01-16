const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const Conversation = require('../models/conversation');
const User = require('../models/user');

// creates new conversation if doesn't exist between 2 users, otherwise find it & returns that id
router.post('/create',authMiddleware,async (req,res)=>{
    let {userId}=req.body;
    try{
        let found=await Conversation.find({users: {
            $all: [userId, req.user.userId]
          }}).populate("users","-password")
        //   console.log(Object.keys(found).length)
          if(Object.keys(found).length === 0){
            // issue is here
            let newConversation = await Conversation.create({name:'sender',users:[userId,req.user.userId]})
            // newConversation = JSON.stringify(newConversation)
            console.log('1',newConversation)
            newConversation = await Conversation.findById(newConversation._id).populate("users")
            console.log('2',newConversation)
            // finalConv = newConversation(newConversation).populate('users','-password')
            // newConversation = await newConversation.populate('users')
            return res.send(newConversation)
          }
        res.send(found)

    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})
router.post('/get-conversationlist',authMiddleware,async (req,res)=>{
    try{
        let conversationList=await Conversation.find({
            users: {
            $in: [req.user.userId]
          }
        }).populate("users","-password").populate("latestMessage")
        res.send(conversationList)
    }
    catch(err){
        res.send(err)
    }
})


module.exports = router;