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
//console.log(cookieKeyValue);
//console.log(cookieValue);

/* for passport.socketio */
//const socket = io('http://localhost:3000/', {
//  query: 'session_id=' + cookieValue
//});

const socket = io();

socket.on('message', message => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="chat-messages"><span> [${message.timestamp}]</span>
    <strong>${message.user}:</strong> ${message.text}</p>`;
  $('#chat-box').append(div);

  // scrolldown automatically
  chatBox.scrollTop(chatBox[0].scrollHeight);
});

socket.on('createGame', () => {
  div.classList.add('gameList');
  div.innerHTML = 'new game created';
});

chatForm.submit( e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);

  // Clear Inputs
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
