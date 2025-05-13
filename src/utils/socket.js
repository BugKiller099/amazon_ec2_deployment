const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5174",
        "https://improved-frontend-dev-tinder.vercel.app",
        "https://frontend-dev-ochre-phi.vercel.app",
        "https://frontend-dev-git-main-bugkiller099s-projects.vercel.app",
        "https://frontend-gmoon4fge-bugkiller099s-projects.vercel.app",
        "http://13.235.23.38",
      ],
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      connectedUsers.set(userId, { socketId: socket.id });
      io.emit("userOnlineStatus", { userId, status: "online" });
      console.log(`🟢 User ${userId} connected. Socket ID: ${socket.id}`);
    }

    socket.on("joinChat", ({ firstName, userId, targetUserId, photoUrl }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(`${firstName} joining room: ${roomId}`);
      socket.join(roomId);

      connectedUsers.set(userId, {
        socketId: socket.id,
        firstName,
        userId,
        photoUrl,
        currentRoom: roomId
      });

      // Notify the target user
      const targetUser = connectedUsers.get(targetUserId);
      if (targetUser) {
        io.to(targetUser.socketId).emit("userInfo", { userId, firstName, photoUrl });
        socket.emit("userInfo", {
          userId: targetUser.userId,
          firstName: targetUser.firstName,
          photoUrl: targetUser.photoUrl
        });
      }
    });

    socket.on("sendMessage", async ({ firstName, userId, targetUserId, text, photoUrl }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(`💬 ${firstName} (${userId}) → ${targetUserId} in ${roomId}: ${text}`);

      try {
        let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
          seen: false,
          seenAt: null
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
      } catch (err) {
        console.error("❌ Error saving message:", err);
      }
    });

    socket.on("markMessagesSeen", async ({ userId, targetUserId }) => {
      try {
        const chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
        if (!chat) return;

        let updated = false;

        chat.messages.forEach((msg) => {
          if (!msg.seen && String(msg.senderId) === String(targetUserId)) {
            msg.seen = true;
            msg.seenAt = new Date();
            updated = true;
          }
        });

        if (updated) {
          await chat.save();
          const senderSocket = connectedUsers.get(targetUserId)?.socketId;
          if (senderSocket) {
            io.to(senderSocket).emit("messagesSeen", { byUserId: userId });
          }
        }
      } catch (err) {
        console.error("❌ Error marking messages as seen:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
      for (const [userId, userData] of connectedUsers.entries()) {
        if (userData.socketId === socket.id) {
          console.log(`User ${userId} (${userData.firstName}) went offline`);
          connectedUsers.delete(userId);
          io.emit("userOnlineStatus", { userId, status: "offline" });
          break;
        }
      }
    });
  });
};

module.exports = initializeSocket;
