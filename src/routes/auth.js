const express = require('express');
const {validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const req = require('express/lib/request');
const authRouter = express.Router();

module.exports = authRouter;

authRouter.post("/signup", async (req, res) => {
    try {
        // Validation of data 
        validateSignUpData(req);

        const { 
            firstName, 
            lastName, 
            emailId, 
            password, 
            skills, 
            about, 
            age, 
            gender 
        } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        
        const user = new User({
            firstName, 
            lastName, 
            emailId, 
            password: passwordHash, 
            skills, 
            about, 
            age, 
            gender
        });
        
        const savedUser = await user.save();
        const token = await savedUser.getJWT();

           res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax",      // 🔁 Allow token to be sent in HTTP requests from same origin
            secure: false,        // 🔁 Secure = false because you're on HTTP
            expires: new Date(Date.now() + 8 * 3600000)
        });
        
        res.send({ 
            message: "User Added successfully!", 
            data: savedUser 
        });
    } catch (err) {
        res.status(400).send("Error saving user: " + err.message);
    }
});

authRouter.post("/login" , async (req, res)=>{
    try{
        const {emailId, password} =req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("EmailId is not present in DB");
        }
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){

            //Create a JWT TOKEN

            const token = await user.getJWT();
            
            //Add the token to cookie and send the response back to the user.
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "Lax",      // 🔁 Allow token to be sent in HTTP requests from same origin
                secure: false,        // 🔁 Secure = false because you're on HTTP
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send(user);

        }else{
            throw new Error("Passwrod is not correct try again");
        }
    }catch(err){
            res.status(400).send("Error :" +err.message);
        }
    
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
    //   secure: true,
      sameSite: "None",
      path: "/",
      expires: new Date(0), 
    });
  
    res.send("Logout Successful");
  });
  

module.exports = authRouter;