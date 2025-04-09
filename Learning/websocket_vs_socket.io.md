## Socket.IO vs WebSocket - Chat App Comparison

### 🔌 Raw WebSocket (Vanilla Implementation)

#### ✅ Pros:
- Lightweight and fast.
- Native browser support.
- Minimal overhead in message size.

#### ❌ Cons:
- No built-in reconnection.
- Manual implementation of broadcasting.
- No message acknowledgments.
- Cannot emit custom/named events easily.
- No built-in support for rooms, middleware, or fallback transports.

#### 💻 Example

**Server (Node.js)**
```js
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', socket => {
  console.log('User connected');

  socket.on('message', message => {
    // Broadcast to all connected clients
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
```

**Client (Browser)**
```js
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  socket.send('Hello from client');
};

socket.onmessage = event => {
  console.log('Message:', event.data);
};
```

---

### ⚡ Socket.IO (Feature-Rich Implementation)

#### ✅ Pros:
- Auto-reconnection.
- Custom/named events.
- Acknowledgements.
- Broadcast support.
- Room & namespace support.
- Middleware & authentication.

#### ❌ Cons:
- Slightly higher overhead in packet size.
- Requires additional server library.

#### 💻 Example

**Server (Node.js + Express)**
```js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('message', data => {
    socket.broadcast.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000);
```

**Client (Browser)**
```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
  const socket = io('http://localhost:3000');

  socket.emit('message', 'Hello from client');

  socket.on('message', (msg) => {
    console.log('Message:', msg);
  });
</script>
```

---

### 🧠 Conclusion
| Feature                  | WebSocket | Socket.IO |
|--------------------------|-----------|-----------|
| Setup Complexity         | 🟢 Simple | 🟢 Simple |
| Event abstraction        | 🔴 No     | 🟢 Yes    |
| Reconnection             | 🔴 No     | 🟢 Yes    |
| Broadcasting             | 🟡 Manual | 🟢 Built-in |
| Acknowledgements         | 🔴 No     | 🟢 Yes    |
| Rooms/Namespaces         | 🔴 No     | 🟢 Yes    |

Use **WebSocket** for lightweight, low-level real-time features. Use **Socket.IO** when you need a robust real-time system with reconnection, rooms, custom events, and more.

