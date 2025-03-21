const express = require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();


//Get all the pending connection request for the loggedIn user

userRouter.get("/user/requests", userAuth, async(req, res)=>{

    try{
        const loggedInUser = req.user;
        const connectRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            "firstName lastName photoUrl age gender about skills"
        );
        res.json({message: "Data fetched successfully",
            data: connectRequests,
        });  

    }catch(err){
        req.status(400).send("ERROR: " + err.message);
    }
    
});

module.exports = userRouter;