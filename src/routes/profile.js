const express = require('express');
const profileRouter = express.Router();
const {userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")
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

profileRouter.patch("/profile/edit" , userAuth, async(req, res) =>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        // console.log(loggedInUser);

        Object.keys(req.body).forEach((key) =>(loggedInUser[key] = req.body[key]));

        // console.log(loggedInUser);
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile is updated successfully` ,
            data: loggedInUser,
        });

    } catch(err){
        res.status(400).send("Error : "+ err.message);
    }
});
module.exports = profileRouter;