const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
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

        socket.on("sendMessage", ({ firstName, userId, targetUserId, text, photoUrl }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            
            console.log(`Message from ${firstName} in room ${roomId}: ${text}`);
            
            // Send the message to all clients in the room (including sender for consistency)
            io.to(roomId).emit("receiveMessage", {
                userId,
                firstName,
                text,
                photoUrl,
                timestamp: new Date().toISOString()
            });
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