/* File: gameLobby.js
 * Purpose:
 *  Client side javascript for the game lobby.
*/

/* ====================================*/
/* ============= socketio =============*/
/* ====================================*/

const socket = io();

/* ======== ON gameLobby Join ======== */
socket.on('gameUserJoin', (userId) => {
  console.log('joined a game!');
  const div = document.createElement('div');

});

