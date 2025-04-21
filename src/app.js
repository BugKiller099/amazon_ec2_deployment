


require('dotenv').config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }
  
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cors = require("cors");
const http = require("http");

const cookieParser = require("cookie-parser");
// ✅ Log the origin before CORS
app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin);
    next();
  });
// const allowedOrigins = [
//     "http://localhost:5173",
//     "https://frontend-dev-git-main-bugkiller099s-projects.vercel.app",
//     "https://frontend-dev-ochre-phi.vercel.app"
//   ];
  
//   app.use(cors({
//     origin: allowedOrigins,
//     credentials: true
//   }));
const allowedOrigins = [
  "http://localhost:5174",
  "https://frontend-dev-ochre-phi.vercel.app"
  "https://frontend-dev-git-main-bugkiller099s-projects.vercel.app",
  "https://frontend-dev-ochre-phi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

  
app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require('./routes/chat');

app.use("/" ,authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);
connectDB()
    .then(() =>{
        console.log("DataBase connection established ...");
        server.listen(process.env.PORT||7777, () =>{
            console.log(`Server is successfully listening on port ${process.env.PORT || 7777}`);
        });
        
    })
    .catch((err)=>{
        console.error("Database cannot be connected");
    });