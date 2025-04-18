const express = require('express');
const {Chat} =require('../models/chat');
const chatRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
chatRouter.get('/chat/:targetUserId' ,userAuth,  async(req, res)=>
{
    const { targetUserId }= req.params;
    const userId = req.user._id;

    try{
        let chat = await Chat.findOne({
            participants:{ $all: [userId, targetUserId]},

        });
        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],

            });
            await chat.save();
        }
        // Now populate the sender info in messages
        await chat.populate({
                path: "messages.senderId",
                select: "firstName lastName photoUrl"
        });
     
        console.log("✅ Chat response data:", JSON.stringify(chat, null, 2));
        res.json(chat);

    }catch(err){
        console.error("Errot fetching or Creting chat:", err.messages);
        res.status(500).json({error: "Server error"});
    }
})

module.exports = chatRouter;

