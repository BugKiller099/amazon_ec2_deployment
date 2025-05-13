const socket = require("socket.io");
const { Chat } = require("../models/chat");
const debug = require('debug')('socket:debug');
const error = require('debug')('socket:error');

/**
 * Enhanced Socket.IO initialization with comprehensive debugging
 * @param {Object} server - HTTP/HTTPS server instance
 * @returns {Object} - Socket.IO instance
 */
const initializeSocket = (server) => {
  console.log('⚙️ Initializing Socket.IO server...');
  
  // Try-catch for the entire initialization
  try {
    // Use a more explicit socket.io version and configuration
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
      },
      // Add these settings to handle connection issues
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 30000,
      allowUpgrades: true,
      transports: ['polling', 'websocket'],
      allowEIO3: true // Allow compatibility with older clients
    });
    
    console.log('✅ Socket.IO server created with settings:', {
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 30000,
      transports: ['polling', 'websocket']
    });
    
    // Debug Socket.IO engine events
    io.engine.on("connection_error", (err) => {
      console.error('🚨 Socket.IO Engine Connection Error:', err.message);
      console.error('🔍 Error details:', err.req);  // Log request details
      console.error('🧩 Error stack:', err.stack);
    });
    
    io.engine.on("initial_headers", (headers, req) => {
      console.log(`🔄 Initial headers for ${req.url}:`, Object.keys(headers));
    });
    
    io.engine.on("headers", (headers, req) => {
      console.log(`📝 Headers for ${req.url}:`, Object.keys(headers));
    });
    
    const connectedUsers = new Map();
    
    // Debug middleware to log connection attempts
    io.use((socket, next) => {
      try {
        console.log('🔍 New socket connection attempt');
        console.log('📋 Handshake query:', socket.handshake.query);
        console.log('🌐 Connection headers:', socket.handshake.headers);
        console.log('🔌 Transport:', socket.conn.transport.name);
        
        const userId = socket.handshake.query.userId;
        
        if (!userId) {
          console.error('❌ Connection rejected: Missing userId');
          return next(new Error('userId is required'));
        }
        
        console.log(`✅ Socket auth passed for user ${userId}`);
        next();
      } catch (err) {
        console.error('🚨 Error in authentication middleware:', err);
        next(new Error('Internal server error during authentication'));
      }
    });
    
    // Listen for connection events
    io.on("connection", (socket) => {
      try {
        const userId = socket.handshake.query.userId;
        const socketId = socket.id;
        const transport = socket.conn.transport.name;
        
        console.log(`🟢 CONNECTED: User ${userId} via ${transport}. Socket ID: ${socketId}`);
        console.log(`🧰 Socket namespace: ${socket.nsp.name}`);
        console.log(`📊 Current room count: ${io.engine.clientsCount}`);
        
        if (userId) {
          connectedUsers.set(userId, { socketId: socket.id });
          io.emit("userOnlineStatus", { userId, status: "online" });
        }
        
        // Debug socket state
        const debugSocketState = () => {
          try {
            const rooms = Array.from(socket.rooms);
            console.log(`📊 Socket ${socket.id} state:`);
            console.log(`👤 User ID: ${userId}`);
            console.log(`🚪 Rooms: ${JSON.stringify(rooms)}`);
            console.log(`🔌 Connected: ${socket.connected}`);
            console.log(`🌐 Transport: ${socket.conn.transport.name}`);
            return true;
          } catch (err) {
            console.error('🚨 Error getting socket state:', err);
            return false;
          }
        };
        
        // Debug command to check socket state
        socket.on("debug", () => {
          debugSocketState();
          socket.emit("debugInfo", {
            socketId: socket.id,
            userId: userId,
            transport: socket.conn.transport.name,
            rooms: Array.from(socket.rooms),
            connected: socket.connected,
            serverTime: new Date().toISOString()
          });
        });
        
        // Monitor socket events for debugging
        socket.conn.on("upgrade", (transport) => {
          console.log(`🔄 Socket ${socket.id} transport upgraded to: ${transport.name}`);
        });
        
        socket.conn.on("close", (reason) => {
          console.log(`🔌 Socket ${socket.id} transport closed: ${reason}`);
        });
        
        socket.on("error", (err) => {
          console.error(`🚨 Socket error for ${socket.id}:`, err);
        });
        
        socket.on("disconnect", (reason) => {
          console.log(`🔴 DISCONNECTED: Socket ${socket.id}, reason: ${reason}`);
          
          // Find and remove user from connected list
          for (const [uid, userData] of connectedUsers.entries()) {
            if (userData.socketId === socket.id) {
              console.log(`📤 User ${uid} marked as offline`);
              connectedUsers.delete(uid);
              io.emit("userOnlineStatus", { userId: uid, status: "offline" });
              break;
            }
          }
          
          console.log(`📊 Remaining connected users: ${connectedUsers.size}`);
          console.log(`📊 Current socket count: ${io.engine.clientsCount}`);
        });
        
        // Handle room joining with detailed logging
        socket.on("joinChat", ({ firstName, userId, targetUserId, photoUrl }) => {
          try {
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(`🚪 ${firstName} (${userId}) joining room: ${roomId}`);
            
            // Before state
            const beforeRooms = Array.from(socket.rooms);
            console.log(`📋 Before join - rooms: ${JSON.stringify(beforeRooms)}`);
            
            socket.join(roomId);
            
            // After state
            const afterRooms = Array.from(socket.rooms);
            console.log(`📋 After join - rooms: ${JSON.stringify(afterRooms)}`);
            
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
              console.log(`📢 Notifying target user ${targetUserId} about ${userId}`);
              io.to(targetUser.socketId).emit("userInfo", { userId, firstName, photoUrl });
              socket.emit("userInfo", {
                userId: targetUser.userId,
                firstName: targetUser.firstName,
                photoUrl: targetUser.photoUrl
              });
            } else {
              console.log(`⚠️ Target user ${targetUserId} not connected`);
            }
            
            console.log(`✅ Join chat complete for ${userId} in room ${roomId}`);
          } catch (err) {
            console.error(`🚨 Error in joinChat:`, err);
            socket.emit("error", { message: "Failed to join chat room" });
          }
        });
        
        // Message sending with debug info
        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text, photoUrl }) => {
          try {
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(`💬 MESSAGE: ${firstName} (${userId}) → ${targetUserId} in ${roomId}`);
            console.log(`📝 Content: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`);
            
            // Check if in correct room
            const inRoom = socket.rooms.has(roomId);
            console.log(`🚪 Sender in correct room: ${inRoom}`);
            
            // Find target socket
            const targetUserData = connectedUsers.get(targetUserId);
            console.log(`🎯 Target user connected: ${!!targetUserData}`);
            if (targetUserData) {
              console.log(`🎯 Target socket: ${targetUserData.socketId}`);
              console.log(`🎯 Target in room: ${io.sockets.adapter.socketRooms(targetUserData.socketId)?.has(roomId)}`);
            }
            
            try {
              let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
              
              if (!chat) {
                console.log(`📝 Creating new chat for users ${userId} and ${targetUserId}`);
                chat = new Chat({
                  participants: [userId, targetUserId],
                  messages: []
                });
              } else {
                console.log(`📝 Found existing chat with ${chat.messages.length} messages`);
              }
              
              chat.messages.push({
                senderId: userId,
                text,
                seen: false,
                seenAt: null,
                timestamp: new Date()
              });
              
              await chat.save();
              console.log(`💾 Message saved to database`);
              
              // Send to room with debug info
              console.log(`📢 Emitting to room: ${roomId}`);
              const roomSockets = await io.in(roomId).fetchSockets();
              console.log(`📊 Number of sockets in room: ${roomSockets.length}`);
              
              io.to(roomId).emit("receiveMessage", {
                userId,
                firstName,
                text,
                photoUrl,
                seen: false,
                timestamp: new Date().toISOString()
              });
              
              console.log(`✅ Message processing complete`);
            } catch (err) {
              console.error(`🚨 Database error in sendMessage:`, err);
              socket.emit("error", { message: "Failed to save message to database" });
            }
          } catch (err) {
            console.error(`🚨 General error in sendMessage:`, err);
            socket.emit("error", { message: "Failed to process message" });
          }
        });
        
        // Keep-alive mechanism
        const intervalId = setInterval(() => {
          if (socket.connected) {
            socket.emit("ping", { time: new Date().toISOString() });
          } else {
            clearInterval(intervalId);
          }
        }, 30000);
        
        socket.on("pong", (data) => {
          console.log(`🏓 Pong from ${userId}, latency: ${new Date() - new Date(data.time)}ms`);
        });
        
      } catch (err) {
        console.error('🚨 Fatal error in socket connection handler:', err);
      }
    });
    
    // Server-wide debugging
    setInterval(() => {
      try {
        const rooms = io.sockets.adapter.rooms;
        const clientsCount = io.engine.clientsCount;
        
        console.log('📊 SOCKET SERVER STATUS:');
        console.log(`📊 Total connected clients: ${clientsCount}`);
        console.log(`📊 Connected users map size: ${connectedUsers.size}`);
        console.log(`📊 Active rooms: ${rooms.size}`);
        
        // Log memory usage
        const memoryUsage = process.memoryUsage();
        console.log('📊 Memory usage:', {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
        });
      } catch (err) {
        console.error('🚨 Error in status monitoring:', err);
      }
    }, 60000); // Every minute
    
    console.log('🚀 Socket.IO server initialized successfully');
    return io;
    
  } catch (err) {
    console.error('💥 FATAL ERROR initializing Socket.IO:', err);
    throw err; // Re-throw to make server initialization fail
  }
};

module.exports = initializeSocket;