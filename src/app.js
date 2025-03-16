// const express = require("express");
// const connectDB = require("./config/database");
// const User = require("./models/user");
// const { validateSignUpData} = require ("./utils/validation")
// const app = express();
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const cors = require("cors");
// const req = require("express/lib/request");
// const cookieParser = require("cookie-parser");
// const {userAuth} = require("./middlewares/auth");
// app.use(express.json());
// app.use(cookieParser());

// app.use(cors());

// // Connect to Database and Start Server
// async function startServer() {
//     try {
//         await connectDB();
//         console.log("Database connected successfully.");

//         app.listen(3000, () => {
//             console.log("Server is running on port 3000");
//         });

//     } catch (error) {
//         console.error("Database connection failed:", error);
//         process.exit(1);
//     }
// }

// // Signup Route
// ///////////////////
// /////////////////
// ////////////////

// //Use validaiotn for login 

// //////////
// ///////////
// /////////


// //profile api

// /////
// /////
// ///

// //send connection request
// ///
// ///
// //

// // Find Users Named 'Ashif'
// async function findUser() {
//     try {
//         const users = await User.find({ firstName: 'tendulkar' }).exec();
//         console.log(users);
//     } catch (error) {
//         console.error("Error fetching users:", error);
//     }
// }
// //find users Named 'John' and Age >=19

// app.delete("/user/:id", async (req, res) =>{
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         if(!user){
//             return res.status(404).send("User not found");
//         }

//         res.send("User was deleted successfully");

//     }catch (err){
//         res.status(400).send("Error deleting user: " +err.message);
//     }
// });


// //UPdate 
// app.patch("/user/:id" , async(req, res) =>{
//     try{
     

//         //define the allowed fields that can be updated
//         const ALLOWED_UPDATED = [ "firstName",
//             "lastName",
//             "password",
//             "age",
//             "gender",
//             "photoUrl",
//             "skills",
//         ];
//         // Extract the keys from the request body
//         const updates = Object.keys(req.body);
//         //Check if all the fields in the requeset body are allowed

//         const isValidUpdate = updates.every(field =>ALLOWED_UPDATED.includes(field));

//         //If any field is not allowed, return a 400 Bad Request response
//         if(!isValidUpdate){
//             return res.status(400).send("Invalid updates detected.");


//         }

//         //if the password is being updated, hash it before saving 
//         if(req.body.password){
//             req.body.password = await bcrypt.hash(req.body.password ,10);

//         }
//         //Find the usr by ID and update the fields provided in the request body
//         const user = await User.findByIdAndUpdate(req.params.id , req.body,{
//             new: true, //Return the updated document
//             renValidators: true, //Run Mongoose validators on the update
//         });

//         //If no user is found with the given ID, return a 404 Not Found response
//         if(!user){
//             return res.status(404).send("User not found");
//         }

//         //send the updated user as the response
//         res.send(user);
//     } catch(err){
//         //If any error occurs, return a 400 Bad Request response with the error message
//         res.status(400).send("Error updating user: " + err.message);
//     }

    
// });
// //delete duplicate email ids from the mongoose database

// async function getAggregateUsers() {
//     try{
//         const result = await User.aggregate([
//             { $group: { _id: "$emailId", count: { $sum: 1 }, docs: { $push: "$_id" } } },
//             { $match: { count: { $gt: 1 } } }
//         ]);

//         // Use a loop instead of .forEach()
//         for (let doc of result) {
//             doc.docs.shift(); // Keep one record and delete duplicates
//             await User.deleteMany({ _id: { $in: doc.docs } });
//         }

//         console.log("Duplicate users deleted successfully!");
//     }catch(error){
//         console.error("Aggregation error : " , error);
//     }
// }

// getAggregateUsers();
// // Find Users Named 'John' and Age >= 18
// async function findJohnUsers() {
//     try {
//         const users = await User.find({ name: 'john', age: { $gte: 18 } }).exec();
//         console.log(users);
//     } catch (error) {
//         console.error("Error fetching users:", error);
//     }
// }

// // Start Server
// startServer();
// findUser();
// findJohnUsers();



const express = require("express");
const app = express();
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/" ,authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);


connectDB()
    .then(() =>{
        console.log("DataBase connection established ...");
        app.listen(7777, () =>{
            console.log("Server is successfully listening on port 7777");
        });
        
    })
    .catch((err)=>{
        console.error("Database cannot be connected");
    });