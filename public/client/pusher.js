/* ====================================*/
/* ==== Pusher Subscription ===========*/
/* ====================================*/
// Enable pusher logging - don't include this in production
//Pusher.logToConsole = true;
console.log('DEBUG: Begining of pusher.js file');

let pusher = new Pusher('fe16d9c5190cef68646f', {
  cluster: 'us3'
});

// get gameId from URL
let url = new URL(window.location.href);
let urlArr = url.pathname.split('/');
let gameId = parseInt(urlArr[3]);

let channel = pusher.subscribe('game' + gameId);

/* ====================================*/
/* ======== Pusher Bindings ===========*/
/* ====================================*/

/* ======= PlayCard ======== */
channel.bind('play-card', data => {
  console.log('inside play-card binding', data.currentPlayer);
  let middleBoard = document.getElementById('board');
  middleBoard.innerHTML =  'Current Player: ' + data.currentPlayer +  
  '  Rotation: ' + data.rotation;

});

