/* ====================================*/
/* ============ pusher ================*/
/* ====================================*/
// Enable pusher logging - don't include this in production
//Pusher.logToConsole = true;

let pusher = new Pusher('fe16d9c5190cef68646f', {
  cluster: 'us3'
});
let channel = pusher.subscribe('lobby');

/* ======= Chat Room ======== */
channel.bind('chat-msg', function(data) {
  let { username, message, timestamp } = data;

  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');

  div.classList.add('message');
  div.innerHTML = `<p class="chat-messages"><span> [${timestamp}]</span>
    <strong>${username}:</strong> ${message}</p>`;
  chatBox.append(div);

  // scrolldown automatically
  chatBox.scrollTop = chatBox.scrollHeight;
});

/* ======== Create Game Button =========*/
channel.bind('create-game', data => {
  let { gameId, numPlayers } = data;
  const gameList = document.getElementById('gameList');
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
  submit.setAttribute('value', 'join - just Created');
  submit.setAttribute('class', 'joinGameButton');

  form.append(submit);
  div.append(form);
  gameList.append(div);
});

/* ====================================*/
/* ========= Event Listeners ==========*/
/* ====================================*/

/* === Chat Room (Pressing enter) ======*/
const chatForm = document.getElementById('chat-form');
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  let response = await fetch('/lobby/chatMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msg: msg,
    }),
  });

  response = await response.json();

  // Clear text input field for user
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

/* ============ Buttons ================ */

let createGameButton = document.getElementById("createGame");
createGameButton.addEventListener('click', async () => {
  // returns gameId
  let response = await fetch('/users/createGame', {
    method: 'POST',
  });
  let { gameId } = await response.json();
});

//$('#logout').on('click', async () => {
let logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', async () => {
  await fetch('/auth/logout', {
    method: 'POST'
  });
  location.reload();
});
