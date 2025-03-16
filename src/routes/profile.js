const express = require('express');
const profileRouter = express.Router();
const {userAuth } = require("../middlewares/auth");
profileRouter.get("/profile" , userAuth, async(req, res)=>{
    try{
      
        
        //validate a token this is alreqdy being done using userAuth as a middleware
        const user = req.user;
        if (!user) {
            return res.status(404).send("ERROR: User data not found in request");
        }

        res.status(200).send(user); // Send user details

    } catch(err){
        res.status(400).send("Error : "+ err.message);
    }
 

});
module.exports = profileRouter;