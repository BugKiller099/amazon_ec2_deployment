const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');
const req = require('express/lib/request');
const { Connection } = require('mongoose');

const userRouter = express.Router();
const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";

//Get all the pending connection request for the loggedIn user

userRouter.get("/user/requests", userAuth, async(req, res)=>{

    try{
        const loggedInUser = req.user;
        const connectRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            USER_SAFE_DATA,
            
        );
        res.json({message: "Data fetched successfully",
            data: connectRequests,
        });  

    }catch(err){
        req.status(400).send("ERROR: " + err.message);
    }
    
});
userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                {toUserId : loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ],
        })
        .populate("fromUserId" ,USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        console.log(connectionRequests);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) 
                return row.toUserId;
            else
                return row.fromUserId;
            
        });

        res.json({ data});

    }catch(err){
        res.status(400).send({message: err.message});
    }
});

module.exports = userRouter;