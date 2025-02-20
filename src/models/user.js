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

const validator = require('validator'); // Import the validator package

const userSchema = new Schema({
    firstName: { 
        type: String, 
        required: true, // First name is mandatory
        minLength: 4, // Minimum length of 4 characters
        maxLength: 30, // Maximum length of 30 characters
        trim: true, // Removes extra spaces at the beginning and end
    },
    lastName: { 
        type: String, 
        trim: true, // Removes extra spaces at the beginning and end
        maxLength: 30, // Maximum length of 30 characters
    },
    emailId: { 
        type: String, 
        required: true, // Email is mandatory
        unique: true, // Ensures no duplicate emails in the database
        trim: true, // Removes extra spaces
        lowercase: true, // Converts email to lowercase
        validate: {
            validator: function(value) {
                // Use validator package to check if the email is valid
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email address.` // Custom error message
        }
    },
    password: { 
        type: String,
        required: true, // Password is mandatory
        minLength: 8, // Minimum length of 8 characters
        validate: {
            validator: function(value) {
                // Use validator package to check if the password is strong
                return validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                });
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        }
    },
    age: { 
        type: Number, 
        min: 13, // Minimum age of 13
        max: 120, // Maximum age of 120
    },
    gender: { 
        type: String,
        trim: true, // Removes extra spaces
        validate: {
            validator: function(value) {
                // Ensures gender is one of the allowed options
                return ["male", "female", "None"].includes(value);
            },
            message: props => `${props.value} is not a valid gender option.` // Custom error message
        }
    },
    photoUrl: {
        type: String, 
        default: "https://geo.com", // Default photo URL if none is provided
        validate: {
            validator: function(value) {
                // Use validator package to check if the URL is valid
                return validator.isURL(value);
            },
            message: props => `${props.value} is not a valid URL.` // Custom error message
        }
    },
    skills: {
        type: [String], // Array of strings
        validate: {
            validator: function(value) {
                // Ensures skills array is not empty and each skill is at least 2 characters long
                return value.length > 0 && value.every(skill => skill.trim().length >= 2);
            },
            message: "Skills array cannot be empty, and each skill must be at least 2 characters long."
        }
    }
}, { timestamps: true }); // Adds `createdAt` and `updatedAt` fields automatically
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
