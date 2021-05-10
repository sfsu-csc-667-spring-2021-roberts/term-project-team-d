/* File: gameLobby.js
 * Purpose:
 *  Client side javascript for the game lobby.
*/

let pusher = new Pusher('fe16d9c5190cef68646f', {
  cluster: 'us3'
});

// get gameId from URL
let url = new URL(window.location.href);
let urlArr = url.pathname.split('/');
let gameId = parseInt(urlArr[3]);

let channel = pusher.subscribe('game-lobby' + gameId);

/* ====================================*/
/* ============= pusher ===============*/
/* ====================================*/

/* ======= Chat Room ======== */
channel.bind('chat-msg', data => {
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

/* ============ ON JOIN ============ */
channel.bind('on-join', data => {
  let username = data.username;
  console.log('a user joined a game!', username);
  let div = document.createElement('div');
  div.innerHTML = '<h3>user: ' + username + ' joined!</h3>';
  let gameUsers = document.getElementById('gameUsers');
  gameUsers.append(div);

  /* update numPlayers */
  let numPlayersHeading = document.getElementById('numPlayers');
  numPlayersHeading.innerHTML = 'Number of Players: ' + data.numPlayers; 
});

/* ======== ON LEAVE ======== */
channel.bind('on-leave', data => {
  let username = data.username;
  console.log('a user left the game!', username);
  let div = document.createElement('div');
  div.innerHTML = '<h3>user: ' + username + ' left!</h3>';
  let gameUsers = document.getElementById('gameUsers');
  gameUsers.append(div);

  /* update numPlayers */
  let numPlayersHeading = document.getElementById('numPlayers');
  numPlayersHeading.innerHTML = 'Number of Players: ' + data.numPlayers; 
});
/* ====================================*/
/* ======== event listeners ===========*/
/* ====================================*/

/* === Chat Room (Pressing enter) ======*/
const chatForm = document.getElementById('chat-form');
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  let chatUrl = '/gameLobby/' + gameId + '/chatMessage';

  let response = await fetch(chatUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msg: msg
    }),
  });

  response = await response.json();

  // Clear text input field for user
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

