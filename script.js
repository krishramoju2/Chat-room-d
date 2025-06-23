const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

function addMessage(msg) {
  const item = document.createElement('li');
  item.textContent = `[${msg.time}] ${msg.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

// ✅ Listen for history
socket.on('message history', (history) => {
  messages.innerHTML = ''; // clear any old messages
  history.forEach(addMessage);
});

// ✅ New message broadcast
socket.on('chat message', (msg) => {
  addMessage(msg);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (value) {
    socket.emit('chat message', value);
    input.value = '';
  }
});
