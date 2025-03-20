const express = require('express');

const requestRouter = express.Router();

const {userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
requestRouter.post("/request/send/:status/:toUserId", userAuth,  async(req, res) =>{
    //Sending a connection requeest
    
        try{
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus =["ignored", "interested"];
            if(!allowedStatus.includes(status)){
                return res
                .status(400)
                .json({message: "Invalid status type: " +status});
            }   

            const toUser = await User.findById(toUserId);

            if(!toUser){
                return res
                .status(484)
                .json({message: "Sending connection to invalid user, user not exists in our database"});
            }

            //IF there is an existing ConnectionRequest
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or:[
                    
                        { fromUserId: fromUserId, toUserId: toUserId },
                        { fromUserId: toUserId , toUserId: fromUserId }
                
                    ],
               
            });

            if(existingConnectionRequest){
                return res
                .status(400)
                .send({ message: "Connection Request already Exists!!!"});
            }


            const connectionRequest = new ConnectionRequest({
                fromUserId, 
                toUserId,
                status,
            });
            const data = await connectionRequest.save();

            res.json({
                message: "Connection Request Sent Successfully!",
                data, 
            });

        }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }

   
    
    
});

module.exports = requestRouter;


