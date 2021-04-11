const chatForm = $('#chat-form');
const chatBox = $('#chat-box');

const socket = io();

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  // scrolldown automatically
  chatBox.scrollTop(chatBox[0].scrollHeight);
});

chatForm.submit( e => {
  e.preventDefault();
  // get message text
  const msg = e.target.elements.msg.value;
  // emitting a message to the server
  socket.emit('chatMessage', msg);

  // Clear Inputs
  e.target.element.msg.value = '';
  e.target.element.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `${message}`;
  $('#chat-box').append(div);
}
