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
          // Add all possible origins your client may connect from
          "http://3.110.187.101",
          "https://3.110.187.101",
          "http://localhost:3000",
          "http://localhost:5173",
          // Add null to allow requests with no origin (like from file://)
          null,
          // Consider adding a wildcard if needed for development
          "*"
        ],
        credentials: true,
        methods: ["GET", "POST"],
        // Add allowed headers
        allowedHeaders: ["Content-Type", "Authorization"]
      },
      // Adjusted settings for better connection stability
      pingTimeout: 30000,         // Reduced from 60000
      pingInterval: 10000,        // Reduced from 25000
      upgradeTimeout: 10000,      // Reduced from 30000
      allowUpgrades: true,
      transports: ['polling', 'websocket'],
      allowEIO3: true,
      path: '/socket.io/', // Ensure the path is correct and matches client
      connectTimeout: 45000
    });
    
    console.log('✅ Socket.IO server created with settings:', {
      pingTimeout: 30000,
      pingInterval: 10000,
      upgradeTimeout: 10000,
      transports: ['polling', 'websocket']
    });
    
    // Log request origins for debugging
    io.engine.on("connection", (socket) => {
      console.log('Request Origin:', socket.request.headers.origin);
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
          console.warn('⚠️ Connection without userId, but allowing for debugging');
          return next(); // Allow connections without userId for debugging
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
        const userId = socket.handshake.query.userId || 'anonymous';
        const socketId = socket.id;
        const transport = socket.conn.transport.name;
        
        console.log(`🟢 CONNECTED: User ${userId} via ${transport}. Socket ID: ${socketId}`);
        console.log(`🧰 Socket namespace: ${socket.nsp.name}`);
        console.log(`📊 Current room count: ${io.engine.clientsCount}`);
        
        // Simple test emit to verify connection
        socket.emit("connectionConfirmed", { 
          socketId, 
          message: "You are connected to the server",
          timestamp: new Date().toISOString()
        });
        
        if (userId && userId !== 'anonymous') {
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
        
        // Monitor transport upgrades
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
            if (!userId || !targetUserId) {
              console.warn(`⚠️ Invalid join chat request: Missing user IDs`);
              socket.emit("error", { message: "Both userId and targetUserId are required" });
              return;
            }
            
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(`🚪 ${firstName || userId} (${userId}) joining room: ${roomId}`);
            
            // Before state
            const beforeRooms = Array.from(socket.rooms);
            console.log(`📋 Before join - rooms: ${JSON.stringify(beforeRooms)}`);
            
            socket.join(roomId);
            
            // After state
            const afterRooms = Array.from(socket.rooms);
            console.log(`📋 After join - rooms: ${JSON.stringify(afterRooms)}`);
            
            // Verify room joining was successful
            if (!socket.rooms.has(roomId)) {
              console.error(`❌ Failed to join room ${roomId}`);
              socket.emit("error", { message: "Failed to join chat room" });
              return;
            }
            
            connectedUsers.set(userId, {
              socketId: socket.id,
              firstName: firstName || userId,
              userId,
              photoUrl,
              currentRoom: roomId
            });
            
            // Confirm room join to the client
            socket.emit("joinedRoom", { roomId });
            
            // Notify the target user if they're connected
            const targetUser = connectedUsers.get(targetUserId);
            if (targetUser) {
              console.log(`📢 Notifying target user ${targetUserId} about ${userId}`);
              io.to(targetUser.socketId).emit("userInfo", { 
                userId, 
                firstName: firstName || userId, 
                photoUrl 
              });
              
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
            if (!userId || !targetUserId || !text) {
              console.warn(`⚠️ Invalid message: Missing required fields`);
              socket.emit("error", { message: "userId, targetUserId, and text are required" });
              return;
            }
            
            const roomId = [userId, targetUserId].sort().join("_");
            console.log(`💬 MESSAGE: ${firstName || userId} (${userId}) → ${targetUserId} in ${roomId}`);
            console.log(`📝 Content: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`);
            
            // Check if in correct room
            const inRoom = socket.rooms.has(roomId);
            console.log(`🚪 Sender in correct room: ${inRoom}`);
            
            // Auto-join room if not already in it
            if (!inRoom) {
              console.log(`🚪 Auto-joining room ${roomId}`);
              socket.join(roomId);
            }
            
            // Find target socket
            const targetUserData = connectedUsers.get(targetUserId);
            console.log(`🎯 Target user connected: ${!!targetUserData}`);
            if (targetUserData) {
              console.log(`🎯 Target socket: ${targetUserData.socketId}`);
              const targetSocket = io.sockets.sockets.get(targetUserData.socketId);
              if (targetSocket) {
                console.log(`🎯 Target in room: ${targetSocket.rooms.has(roomId)}`);
                if (!targetSocket.rooms.has(roomId)) {
                  console.log(`🚪 Auto-joining target to room ${roomId}`);
                  targetSocket.join(roomId);
                }
              }
            }
            
            try {
              // Save to database
              let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
              
              if (!chat) {
                console.log(`📝 Creating new chat for users ${userId} and ${targetUserId}`);
                chat = new Chat({
                  participants: [userId, targetUserId],
                  messages: []
                });
                // Log the newly created chat
                console.log('✅ Chat created:', chat);
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
              console.log('✅ Chat response data:', chat);
              
              // Send to room with debug info
              console.log(`📢 Emitting to room: ${roomId}`);
              const roomSockets = await io.in(roomId).fetchSockets();
              console.log(`📊 Number of sockets in room: ${roomSockets.length}`);
              console.log(`📊 Socket IDs in room: ${roomSockets.map(s => s.id).join(', ')}`);
              
              const messageData = {
                userId,
                firstName: firstName || userId,
                text,
                photoUrl,
                seen: false,
                timestamp: new Date().toISOString()
              };
              
              // Emit to room
              io.to(roomId).emit("receiveMessage", messageData);
              
              // Also emit directly to sender and recipient for redundancy
              socket.emit("receiveMessage", messageData);
              if (targetUserData) {
                io.to(targetUserData.socketId).emit("receiveMessage", messageData);
              }
              
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
        
        // Keep-alive mechanism with shorter interval
        const intervalId = setInterval(() => {
          if (socket.connected) {
            socket.emit("ping", { time: new Date().toISOString() });
          } else {
            clearInterval(intervalId);
          }
        }, 20000); // Every 20 seconds
        
        socket.on("pong", (data) => {
          console.log(`🏓 Pong from ${userId}, latency: ${new Date() - new Date(data.time)}ms`);
        });
        
      } catch (err) {
        console.error('🚨 Fatal error in socket connection handler:', err);
      }
    });
    
    // Server-wide debugging with less frequent intervals
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