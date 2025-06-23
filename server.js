const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname)); // Serve files from root

let messageHistory = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send message history
  socket.emit('message history', messageHistory);

  socket.on('chat message', (msgText) => {
    const msg = {
      text: msgText,
      time: new Date().toLocaleTimeString(),
    };

    messageHistory.push(msg);
    if (messageHistory.length > 100) messageHistory.shift();

    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
