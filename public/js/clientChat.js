const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const chatMessage = document.getElementById('chatMessage');
const transfer = document.getElementById('transfer');

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
  e.preventDefault();
  if (chatMessage.value) {
    socket.emit('chatMessage', chatMessage.value);
    chatMessage.value = '';
  }
});

socket.on('chatMessage', (name, msg) => {
  const item = document.createElement('li');
  item.classList.add('chatMessage');
  item.textContent = `${name}: ${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

transfer.addEventListener('submit', (e) => {
  e.preventDefault();

  const to = document.getElementById('to').value;
  const amount = parseInt(document.getElementById('amount').value, 10);

  socket.emit('sendCoins', to, amount);
});

socket.on('receiveCoins', (from, amount, newBalance) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} sent you ${amount} coins. You now have ${newBalance} total coins`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
