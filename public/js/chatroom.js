const chatForm = $('#chat-form');

const socket = io();

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
});

chatForm.submit( e => {
  e.preventDefault();
  // get message text
  const msg = e.target.elements.msg.value;
  // emitting a message to the server
  socket.emit('chatMessage', msg);
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `${message}`;
  $('#chat-box').append(div);
}
