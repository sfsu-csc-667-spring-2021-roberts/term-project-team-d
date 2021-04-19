/* File: gameLobby.js
 * Purpose:
 *  Client side javascript for the game lobby.
*/

/* ====================================*/
/* ============= socketio =============*/
/* ====================================*/

/* instead of create new socket here 
  * maybe we can use the one we made in the lobby */

//const socket = io();

/* ======== ON gameLobby Join ======== */
socket.on('gameUserJoin', (userId) => {
  console.log('a user joined a game!', userId);
  let div = document.createElement('div');
  div.innterHTML = '<h3>user with userId: ' + userId + ' joined!</h3>'
  $('#gameUsers').append(div);
});

