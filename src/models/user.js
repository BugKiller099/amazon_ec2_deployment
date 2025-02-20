// const mongoose = require('mongoose');

// const {Schema, model} = mongoose; 
// const userSchema = new Schema({
//     firstName: {
//         type: String ,
//         required: true,
//     },
//     lastName: {
//         type: String 

//     },
//     emailId: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String
//     },
//     age:{
//         type: Number
//     },
//     gender: {
//         type: String
//     }
// });

// const User =model("User", userSchema);
// module.exports = User;

const mongoose = require('mongoose');

const { Schema, model } = mongoose; 

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true },
    password: { type: String },
    age: { type: Number },
    gender: { type: String }
});

// Ensure index creation
userSchema.index({ emailId: 1 }, { unique: true });

const User = model("User", userSchema);

// Force index creation
User.syncIndexes();

module.exports = User;
