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

// ✅ Hardcoded allowed origins
const allowedOrigins = [
  "http://3.110.187.101",
];

// ✅ Log the origin before CORS middleware
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow curl, mobile apps
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

// ✅ Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// ✅ Socket setup
const initializeSocket = require("./utils/socket");
const server = http.createServer(app);
initializeSocket(server);

// ✅ DB + Server start
connectDB()
  .then(() => {
    console.log("Database connection established...");
    const port = process.env.PORT || 7777;
    server.listen(port, () => {
      console.log(`Server is successfully listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
