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

//console.log(window.location.origin);
const socket = io();
console.log(socket);// is this the same as back end socket?


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
  form.setAttribute("method", "get");
  form.setAttribute("action", url);

  // submit button
  let submit = document.createElement('input');
  submit.setAttribute('data-gameId', gameId);
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'join game');
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

$('#createGame').on("click", async () => {
  // returns gameId
  let response = await fetch('/users/createGame', {
    method: 'POST',
  });
  let { gameId } = await response.json();

  // send gameId to socket
  socket.emit('createGame', gameId);

});

$('.joinGameButton').on('click', function(e) {
  let gameId = $(e.target).data('gameid');
  socket.emit('joinGame', gameId);
});

$('#logout').on('click', async () => {
  await fetch('/auth/logout', {
    method: 'POST'
  });
  location.reload();
});
