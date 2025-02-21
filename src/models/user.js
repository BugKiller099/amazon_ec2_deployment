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
    firstName: { 
        type: String, 
        required: true,
        minLength: 4, 
    },
    lastName: { type: String },
    emailId: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
    },
    password: { 
        type: String,
        required: true, 
    },
    age: { type: Number },
    gender: { 
        type: String,
        validate: {
            validator: function(value) {
                return ["male", "female", "None"].includes(value);
            },
            message: props => `${props.value} is not a valid gender option.`
        }
    },
    photoUrl: {
        type: String, 
        default: "https://geo.com"
    },
    skills:{
        type: [String],
    }
},{timestamps: true});

// Ensure index creation
userSchema.index({ emailId: 1 }, { unique: true });

const User = model("User", userSchema);

// Force index creation asynchronously
(async () => {
    try {
        await User.syncIndexes();
        console.log("Indexes synced successfully.");
    } catch (error) {
        console.error("Error syncing indexes:", error);
    }
})();

module.exports = User;
