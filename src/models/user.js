
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
userSchema.method.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({ _id: user._id}, "Ashif@123" , {
        expiresIn: "7d",
    });

    return token;
}
module.exports = User;
