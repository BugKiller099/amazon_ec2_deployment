// Client-side Socket.IO connection code

import { io } from "socket.io-client";
import { useState, useEffect } from "react";

const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [transportType, setTransportType] = useState(null);
  
  useEffect(() => {
    if (!userId) return;
    
    // Use polling-only for AWS server
    // AWS EC2 sometimes has issues with WebSocket upgrades
    const socketInstance = io("http://3.110.187.101", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      query: { userId },
      transports: ['polling'],  // Force polling only to avoid WebSocket issues
      forceNew: true,           // Avoid reusing connections
      withCredentials: true,    // Include credentials
      extraHeaders: {
        "Cache-Control": "no-store",
        "Connection": "keep-alive"
      }
    });
    
    // Log critical events
    console.log("Creating socket connection to http://3.110.187.101");
    
    // Connection events
    socketInstance.on("connect", () => {
      console.log("Socket connected!", socketInstance.id);
      console.log("Transport type:", socketInstance.io.engine.transport.name);
      setTransportType(socketInstance.io.engine.transport.name);
      setIsConnected(true);
      setConnectionError(null);
      
      // Force a rejoin to any active chats on reconnection
      // This helps recover state after connection issues
      console.log("Sending ping to verify connection");
      socketInstance.emit("ping", { time: new Date().toISOString() });
    });
    
    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      setConnectionError(err.message);
      
      // Try again with different settings if connection fails
      if (err.message.includes("websocket")) {
        console.log("Retrying with polling transport only");
        socketInstance.io.opts.transports = ['polling'];
      }
    });
    
    socketInstance.io.engine.on("upgrade", (transport) => {
      console.log(`Transport upgraded to: ${transport}`);
      setTransportType(transport);
    });
    
    socketInstance.io.engine.on("upgradeError", (err) => {
      console.error("Transport upgrade error:", err);
    });
    
    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      
      // Handle reconnection for certain disconnect reasons
      if (reason === "io server disconnect" || reason === "transport close") {
        // Server disconnected us, need to reconnect manually
        console.log("Attempting manual reconnect...");
        setTimeout(() => {
          socketInstance.connect();
        }, 1000);
      }
    });
    
    socketInstance.on("connectionConfirmed", (data) => {
      console.log("Connection confirmed by server:", data);
    });
    
    // Message event
    socketInstance.on("receiveMessage", (message) => {
      console.log("New message received:", message);
      setLastMessage(message);
    });
    
    // Keep-alive response
    socketInstance.on("ping", (data) => {
      socketInstance.emit("pong", data);
    });
    
    // Error handling
    socketInstance.on("error", (errorData) => {
      console.error("Socket error:", errorData);
      alert(`Socket error: ${errorData.message}`);
    });
    
    // Cleanup on unmount
    setSocket(socketInstance);
    
    return () => {
      if (socketInstance) {
        console.log("Disconnecting socket...");
        socketInstance.disconnect();
      }
    };
  }, [userId]);
  
  // Helper function to join a chat
  const joinChat = (targetUserId, firstName, photoUrl) => {
    if (!socket || !isConnected) {
      console.error("Cannot join chat: Socket not connected");
      return false;
    }
    
    socket.emit("joinChat", {
      userId,
      targetUserId,
      firstName,
      photoUrl
    });
    
    return true;
  };
  
  // Helper function to send a message
  const sendMessage = (targetUserId, text, firstName, photoUrl) => {
    if (!socket || !isConnected) {
      console.error("Cannot send message: Socket not connected");
      return false;
    }
    
    socket.emit("sendMessage", {
      userId,
      targetUserId,
      text,
      firstName: firstName || userId,
      photoUrl
    });
    
    return true;
  };
  
  // Request debug info
  const requestDebugInfo = () => {
    if (!socket || !isConnected) return null;
    socket.emit("debug");
  };
  
  return {
    socket,
    isConnected,
    lastMessage,
    connectionError,
    joinChat,
    sendMessage,
    requestDebugInfo
  };
};

export default useSocket;