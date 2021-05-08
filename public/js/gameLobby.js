/* File: gameLobby.js
 * Purpose:
 *  Client side javascript for the game lobby.
*/

// get gameId from URL
let url = new URL(window.location.href);
let urlArr = url.pathname.split('/');
let gameId = parseInt(urlArr[3]);

/* ====================================*/
/* ============= socketio =============*/
/* ====================================*/

/* ======== ON gameLobby Join ======== */
/*
socket.on('gameUserJoin', username => {
  console.log('a user joined a game!', username);
  let div = document.createElement('div');
  div.innerHTML = '<h3>user: ' + username + ' joined!</h3>';
  $('#gameUsers').append(div);
});
*/
