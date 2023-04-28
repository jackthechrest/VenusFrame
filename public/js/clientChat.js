const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const chatMessage = document.getElementById('chatMessage');

// eslint-disable-next-line no-undef
const socket = io();
socket.on('enteredChat', (msg) => {
  const item = document.createElement('li');
  item.classList.add('enterChatMessage');
  item.textContent = `${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('exitedChat', (msg) => {
  const item = document.createElement('li');
  item.classList.add('enterChatMessage');
  item.textContent = `${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

chatForm.addEventListener('submit', (e) => {
  console.log('form was submitted');
  e.preventDefault();
  if (chatMessage.value) {
    console.log('emitting message');
    socket.emit('chatMessage', chatMessage.value);
    chatMessage.value = '';
  }
});

socket.on('chatMessage', (name, msg) => {
  console.log('got chat message');
  const item = document.createElement('li');
  item.classList.add('chatMessage');
  item.textContent = `${name}: ${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
