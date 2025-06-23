const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname)); // serve index.html and script.js from root

// Save messages in memory (limit to last 100)
let messageHistory = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send full message history to the newly connected client
  socket.emit('message history', messageHistory);

  // When a new message is received
  socket.on('chat message', (msgText) => {
    const msg = {
      text: msgText,
      time: new Date().toLocaleTimeString(),
    };

    // Save message and enforce limit
    messageHistory.push(msg);
    if (messageHistory.length > 100) messageHistory.shift();

    // Send to all connected clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
