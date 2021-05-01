/* ====== Getting Cookie for User Object (Perhaps unecessary) ========*/
/* Parsing cookies to get connect.sid for passport.sockio */
//let cookies = document.cookie;
//let cookiesArr = cookies.split(',');
//let cookieKeyValue = "";
//let cookieValue = "";
//for (let cookie of cookiesArr) {
//  cookieKeyValue = cookie
//  cookie = cookie.split('=');
//  if (cookie[0] == 'connect.sid') {
//    cookieValue = cookie[1];
//    break;
//  }
//}
////console.log(cookieKeyValue);
//console.log(cookieValue);
//console.log(window.location.host);

//const socket = io.connect('//' + window.location.host, {
//  query: 'connect.sid=' + cookieValue
//});

/* ====================================*/
/* ============  socketio =============*/
/* ====================================*/

const socket = io(window.location.origin);

/*
socket.on('connection', user => {
  socket.user = user;
}
*/


/* ======= Chat Room ======== */
socket.on('message', message => {
  const chatBox = $('#chat-box');
  const div = document.createElement('div');

  div.classList.add('message');
  div.innerHTML = `<p class="chat-messages"><span> [${message.timestamp}]</span>
    <strong>${message.user}:</strong> ${message.text}</p>`;
  chatBox.append(div);

  // scrolldown automatically
  chatBox.scrollTop(chatBox[0].scrollHeight);
});

/* ======== Create Game Button =========*/
socket.on('createGame', (gameId, numPlayers) => {
  const gameList = $('#gameList');
  const div = document.createElement('div');

  div.classList.add('gameli');
  div.innerHTML = '<li>Game id: ' + gameId;

  // Create Form
  let url = '/users/joinGame/' + gameId;
  let form = document.createElement('form');
  form.setAttribute("method", "POST");
  form.setAttribute("action", url);

  // submit button
  let submit = document.createElement('input');
  submit.setAttribute('data-gameId', gameId);
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'join just Created');
  submit.setAttribute('class', 'joinGameButton');

  form.append(submit);
  div.append(form);
  gameList.append(div);
});

/* ====================================*/
/* ========= Event Listeners ========== */
/* ====================================*/

/* ========= Chat Room ==============*/
const chatForm = $('#chat-form');
chatForm.submit( e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);

  // Clear text input field for user
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

/* ============ Buttons ================ */

$('#createGame').on("click", async () => {
  // returns gameId
  let response = await fetch('/users/createGame', {
    method: 'POST',
  });
  let { gameId } = await response.json();

  // send gameId to socket
  socket.emit('createGame', gameId);

});

$('#logout').on('click', async () => {
  await fetch('/auth/logout', {
    method: 'POST'
  });
  location.reload();
});

// ====== pusher chat =====
const Pusher = require('pusher');

const pusher = new Pusher({
  appId:process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true  
});

const channel = window.dprj.pusher.subscribe('chat-lobby');

const messageBox = document.querySelector('#message-box');
const chatArea = document.querySelector('#messages');

channel.bind('message', ( message, timestamp) =>{
  // alert(JSON.stringify(data));
  const div = document.createDocumentFragment('div');
  div.innerHTML = `<b>${ timestamp.format('MMMM Do YYYY, h:mm:ss a') }<b> ${message} `;
  chatArea.appendChild();
});

const sendMessage = () =>{
  const message = messageBox.value;
  messageBox.value = "";

  // prof said change id to post game room id for game-chat
  fetch('/chat/0', {
    headers: {'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify( { message } ),
  }).then(_=> console.log('message sent'))
  .catch(consle.log);
}
  
messageBox.querySelector('#message-box').addEventListener('keyup', event =>{
  if (event.keyCode === 13){
    sendMessage();
  }
});

document.querySelector('#message-box').addEventListener('click', event =>{
  sendMessage();
});