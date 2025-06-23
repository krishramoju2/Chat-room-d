const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Function to add a message element
function addMessage(msg) {
  const item = document.createElement('li');
  item.textContent = `[${msg.time}] ${msg.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

// On connect, receive message history
socket.on('message history', (history) => {
  messages.innerHTML = ''; // Clear old
  history.forEach(addMessage);
});

// On new incoming message
socket.on('chat message', (msg) => {
  addMessage(msg);
});

// On submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (value) {
    socket.emit('chat message', value);
    input.value = '';
  }
});
