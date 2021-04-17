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

/* ======== Socketio ============*/
const socket = io();

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

socket.on('createGame', (gameId) => {
  const gameList = $('#gameList');
  const div = document.createElement('div');

  div.classList.add('gameli');
  div.innerHTML = '<li>Game id: ' + gameId + '| Players: 1 </div>';
  gameList.append(div);
});


/* ========= Event Listeners ========== */
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

$('#logout').on('click', async () => {
  await fetch('/auth/logout', {
    method: 'POST'
  })
  location.reload();
});

//$('.joinGame').on('click', (event) => {
//  let gameId = $(event.target).attr("id");
//  fetch(`/users/joinGame/${gameId}`, {
//    method: 'GET',
//    headers: {
//      'Content-Type': 'text/html'
//    },
//  });
//});
