// const mongoose = require('mongoose');


// const connectDB = async ()=>{
//     await mongoose.connect(
//         "mongodb+srv://ashifdb:AshifGt456@cluster.nt5tos9.mongodb.net/library"
//     );
// };

// module.exports = connectDB;
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
