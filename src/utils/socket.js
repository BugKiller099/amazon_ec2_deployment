const socket = require("socket.io");
const { Chat } = require("../models/chat"); // Adjust path if needed
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://frontend-dev-ochre-phi.vercel.app", // Main frontend domain
                "https://frontend-dev-git-main-bugkiller099s-projects.vercel.app", // Another frontend domain
                "https://frontend-gmoon4fge-bugkiller099s-projects.vercel.app"  // Another frontend domain
            ],
            credentials: true,  // Allow sending cookies/headers
            methods: ["GET", "POST"]
        },
    });

    // Track connected users
    const connectedUsers = new Map();

    io.on("connection", (socket) => {
        console.log("🟢 New client connected:", socket.id);
        console.log("Active socket IDs now:", Array.from(io.sockets.sockets.keys()));
        

        socket.on("joinChat", ({ firstName, userId, targetUserId, photoUrl }) => {
            // Create a unique room ID by sorting and joining the user IDs
            const roomId = [userId, targetUserId].sort().join("_");
            
            console.log(`${firstName} joining room: ${roomId}`);
            
            // Join the room
            socket.join(roomId);
            
            // Store user info in the connected users map
            connectedUsers.set(userId, {
                socketId: socket.id,
                firstName,
                userId,
                photoUrl,
                currentRoom: roomId
            });
            
            // Emit user info to the other person in the chat
            if (connectedUsers.has(targetUserId)) {
                io.to(connectedUsers.get(targetUserId).socketId).emit("userInfo", {
                    userId,
                    firstName,
                    photoUrl
                });
            }
            
            // Send target user info if available
            if (connectedUsers.has(targetUserId)) {
                const targetUserInfo = connectedUsers.get(targetUserId);
                socket.emit("userInfo", {
                    userId: targetUserInfo.userId,
                    firstName: targetUserInfo.firstName,
                    photoUrl: targetUserInfo.photoUrl
                });
            }
        });

        socket.on("sendMessage",async({ firstName, userId, targetUserId, text, photoUrl }) => {
            

            // Save message to the database
            try{
                const roomId = [userId, targetUserId].sort().join("_");
                console.log(`Message from ${firstName} in room ${roomId}: ${text}`);
                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]},

                   

                });

                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                    seen: false,
                    seenAt: null,
                });

                await chat.save();
                io.to(roomId).emit("receiveMessage", {
                    userId,
                    firstName,
                    text,
                    photoUrl,
                    seen: false,
                    timestamp: new Date().toISOString()
                });
 
            }catch(err){
                console.error("Error saving message:", err);

            }
            
            // Send the message to all clients in the room (including sender for consistency)
            
        });

        socket.on("markMessagesSeen", async ({ userId, targetUserId }) => {
            try {
              const chat = await Chat.findOne({
                participants: { $all: [userId, targetUserId] },
              });
          
              if (!chat) return;
          
              let updated = false;
          
              chat.messages.forEach((message) => {
                if (
                  !message.seen &&
                  String(message.senderId) === String(targetUserId) // message was from the *other* user
                ) {
                  message.seen = true;
                  message.seenAt = new Date();
                  updated = true;
                }
              });
          
              if (updated) {
                await chat.save();
          
                // Optionally notify the sender that messages were seen
                const senderSocket = connectedUsers.get(targetUserId)?.socketId;
                if (senderSocket) {
                  io.to(senderSocket).emit("messagesSeen", { byUserId: userId });
                }
              }
          
            } catch (err) {
              console.error("Error marking messages as seen:", err);
            }
          });
          

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            
            // Find and remove the disconnected user from our map
            for (const [userId, userData] of connectedUsers.entries()) {
                if (userData.socketId === socket.id) {
                    console.log(`User ${userId} (${userData.firstName}) disconnected`);
                    connectedUsers.delete(userId);
                    break;
                }
            }
        });
    });
};

module.exports = initializeSocket;