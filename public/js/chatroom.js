const chatForm = $('#chat-form');
const chatBox = $('#chat-box');

/* Parsing cookies to get connect.sid for passport.sockio */
let cookies = document.cookie;
let cookiesArr = cookies.split(',');
let cookieKeyValue = "";
let cookieValue = "";
for (let cookie of cookiesArr) {
  cookieKeyValue = cookie
  cookie = cookie.split('=');
  if (cookie[0] == 'connect.sid') {
    cookieValue = cookie[1];
    break;
  }
}
console.log(cookieKeyValue);
console.log(cookieValue);

//const socket = io('http://localhost:3000/', {
//  query: 'session_id=' + cookieValue
//});

const socket = io();

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  // scrolldown automatically
  chatBox.scrollTop(chatBox[0].scrollHeight);
});

socket.on("connect_error", err => {
  console.log(err instanceof Error); // true
  console.log(err.message); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});

chatForm.submit( e => {
  e.preventDefault();
  // get message text
  const msg = e.target.elements.msg.value;
  // emitting a message to the server
  socket.emit('chatMessage', msg);

  // Clear Inputs
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `${message}`;
  $('#chat-box').append(div);
}
