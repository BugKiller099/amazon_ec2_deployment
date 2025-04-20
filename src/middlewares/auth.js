const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userAuth =async (req, res, next) =>{
    //Read the token form the req cookiews

    try{
        const {token} = req.cookies;
    //validate the token

    if(!token){
        return res.status(401).send("ERROR: Please login!");
    }

    const decodedObj = await jwt.verify(token , process.env.JWT_SECRET);

    const {_id} = decodedObj;

    const user = await User.findById(_id);


    //Find the user

    if(!user){
        return res.status(404).send("ERROR: User not found");
    }
    
    req.user= user;
    next();// to move to the request handler;


    }catch(err){
        res.status(400).send("ERROR: " +err.message);
    }
    



};

module.exports ={
     userAuth, 

};


