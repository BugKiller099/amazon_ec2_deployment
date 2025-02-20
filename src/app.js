// // const express = require('express');
// // const app = express();
// // // app.get("/home/*" ,(req, res) =>{
// // //     res.send("This is a /home route");
// // // })
// // // GET /USERS => midlleware chain => request handler
// // //till it reaches the respond 
// // //Method chain all the function that gives reponse are called middlewares;
// // //take the req and give the responce by going through a chain of middlewares.
// // // seperate route handlers
// // // app.get("/home/name",(req,res)=>{
// // //     res.send("this is /home/name route");
// // // })

// // // app.use("/" ,(req, res) =>{
// // //     res.send("handling / route");
// // // })
// // // app.get(
// // //     "/user",
// // //     (req, res, next)=>{
// // //         next();
// // //     },
// // //     (req, res)=>{
// // //         next();
// // //     },
// // //     (req, res, next) =>{
// // //         res.send("2nd Route handler");
// // //     }
// // // );
// // // app.use(
// // //     "/user",
// // //     (req, res ,next) =>{
// // //     console.log("handling the route user!!!");
// // //     next();
// // // },
// // // (req, res)=>{
// // //     console.log("Handling the route user 2!!");
// // //     res.send("2nd Response!!");
// // // });Auth middleware for only GE

// // //Handle 

// // const {adminAuth ,userAuth} = require("./middlewares/auth.js")

// // app.use("/admin" , adminAuth);
// // app.get("/admin/getAllData" ,(req, res)=>{
// //     //check if the request is autherized
// //     //Logic of checking if the request is authorized 

// //     res.send("all data is send using middleware ");
// // });
// // app.use("/user", userAuth);
// // app.get("/user" ,userAuth, (req, res)=>{
// //     console.log("User got thy data");
// // });

// // app.get("/getUserData" , (req, res) =>{
// //     throw new Error("hello");
// //     res.send("User data sent");
// // });

// // app.use("/" , (err, req, res, next )=>{
// //     if(err){

// //         //Log you error
// //         res.status(500).send("leaning error this is not well setteled ");
// //     }
// // });
// // app.get("/admin/deleteUser",(req, res)=>{
// //     //Logic of checking if the request 

// //     res.send("Deleted a user");
// // })
// // // app.get('/test' ,(req, res) => {
// // //     res.send("this is a /test route");
// // // })
// // // app.listen(3000, () =>{
// // //     console.log("بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ");
// // // });
// // // app.get("/" ,(req, res)=>{
// // //     res.send("this is the base / route");
// // // });
// // // // app.use((req, res) =>{
// // // //     res.send("Hello form the server");
// // // // });

// // app.listen(7777, ()=>{
// //     console.log("listening on port 7777");
// // })

// // const express = require("express");

// // const connectDB = require("./config/database");

// // const app = express();

// // connectDB()
// //     .then(()=>{
// //         console.log("Databse connection established... ");
// //     })
// //     .catch((err) => {
// //         console.error("Database cannot be connected!!");
// //     });

// const express = require("express");
// const connectDB = require("./config/database");

// const app = express();
// const User = require("./models/user");

// app.use(express.json());
// // app.post("/signup" , async(req, res) =>{
// //     console.log(req.body);
// // })
// app.post("/signup", async (req, res)=>{
//     // const user= new User({
//     //     firstName: "ashif",
//     //     lastName : "jamal",
//     //     emailId: "hello@yahoo.hotmal.com",
//     //     password: "secretrecipre",
//     // });
//     const user= new User(req.body);
//     try{
//         await user.save();

//         res.send("User added successfully");
//     }catch(err){
//         res.status(400).send("Error saving the user:"+ err.message);
//     }
   
// });
// // find all documents named john and at least 18
// async function findUser(){
//     try{
//         const users = await User.find({firstName: 'ashif'}).exec();
//         console.log(users);
//     }catch(error){
//         console.error("error fetchign users: ",error);
//     }

// }
// findUser();
// await User.find({ name: 'john', age: { $gte: 18 } }).exec();
// connectDB(); // No need to use `.then()` and `.catch()`, since errors are handled inside connectDB.

// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });
// // (async()=>{
// //     try{
// //         await connectDB();

// //     app.listen(3000, ()=>{
// //         console.log("server is running on port 3000");

// //     });
// //     }catch (error){
// //         console.error("Error connecting database");
// //         process.exit(1);
// //     }
    
// // });

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());

// Connect to Database and Start Server
async function startServer() {
    try {
        await connectDB();
        console.log("Database connected successfully.");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

// Signup Route
app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send("User added successfully");
    } catch (err) {
        res.status(400).send("Error saving user: " + err.message);
    }
});

// Find Users Named 'Ashif'
async function findUser() {
    try {
        const users = await User.find({ firstName: 'tendulkar' }).exec();
        console.log(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
//find users Named 'John' and Age >=19

app.delete("/user/:id", async (req, res) =>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user){
            return res.status(404).send("User not found");
        }

        res.send("User was deleted successfully");

    }catch (err){
        res.status(400).send("Error deleting user: " +err.message);
    }
});


//UPdate 
app.patch("/user/:id" , async(req, res) =>{
    try{
     

        //define the allowed fields that can be updated
        const ALLOWED_UPDATED = [ "firstName",
            "lastName",
            "password",
            "age",
            "gender",
            "photoUrl",
            "skills",
        ];
        // Extract the keys from the request body
        const updates = Object.keys(req.body);
        //Check if all the fields in the requeset body are allowed

        const isValidUpdate = updates.every(field =>ALLOWED_UPDATED.includes(field));

        //If any field is not allowed, return a 400 Bad Request response
        if(!isValidUpdate){
            return res.status(400).send("Invalid updates detected.");


        }

        //if the password is being updated, hash it before saving 
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password ,10);

        }
        //Find the usr by ID and update the fields provided in the request body
        const user = await User.findByIdAndUpdate(req.params.id , req.body,{
            new: true, //Return the updated document
            renValidators: true, //Run Mongoose validators on the update
        });

        //If no user is found with the given ID, return a 404 Not Found response
        if(!user){
            return res.status(404).send("User not found");
        }

        //send the updated user as the response
        res.send(user);
    } catch(err){
        //If any error occurs, return a 400 Bad Request response with the error message
        res.status(400).send("Error updating user: " + err.message);
    }

    
});
//delete duplicate email ids from the mongoose database

async function getAggregateUsers() {
    try{
        const result = await User.aggregate([
            { $group: { _id: "$emailId", count: { $sum: 1 }, docs: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        // Use a loop instead of .forEach()
        for (let doc of result) {
            doc.docs.shift(); // Keep one record and delete duplicates
            await User.deleteMany({ _id: { $in: doc.docs } });
        }

        console.log("Duplicate users deleted successfully!");
    }catch(error){
        console.error("Aggregation error : " , error);
    }
}

getAggregateUsers();
// Find Users Named 'John' and Age >= 18
async function findJohnUsers() {
    try {
        const users = await User.find({ name: 'john', age: { $gte: 18 } }).exec();
        console.log(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Start Server
startServer();
findUser();
findJohnUsers();
