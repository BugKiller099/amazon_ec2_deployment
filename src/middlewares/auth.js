const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userAuth =async (req, res, next) =>{
    //Read the token form the req cookiews

    try{
        const {token} = req.cookies;
    //validate the token

    if(!token){
        return res.status(401).send("ERROR: Token is missing!");
    }

    const decodedObj = await jwt.verify(token , "Ashif@123");

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


// const adminAuth = (req, res, next)=>{
//     console.log("admin auth is being checked");
//     const token="xyz";
//     const isAdminAutherized = token=== "xyz";
//     if(!isAdminAutherized){
//         res.status(401).send("Authorized request");
//     }else {
//         next();
//     }
// };
// const userAuth = (req, res, next)=>{
//     console.log("user auth is being checked");
//     const token="xyz";
//     const isAdminAutherized = token=== "xyz";
//     if(!isAdminAutherized){
//         res.status(401).send("Authorized request");
//     }else {
//         next();
//     }
// };