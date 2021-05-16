import { setPile, addCard } from './main.js';
import {notify} from './notifications.js';
import {getPlayerNum, updateRotation, updateCurrentPlayer, updatePlayers} from './players.js';

/*
 * Pusher subscription
 */

// TODO: Temporary pusher logging, DON'T include this in production!
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

/*
 * Pusher bindings
 */

/* ======= drawCard ======== */
channel.bind('draw-card', async data =>  {
  console.log('inside the draw-card bind')
  let playerNum = await getPlayerNum(gameId);

  //console.log('playerNum object: '+ playerNum);

  //update player display
  let numPlayersCards = data.numPlayersCards;
  updatePlayers(playerNum, numPlayersCards);
})

/* ======= playCard ======== */
channel.bind('play-card', async data =>  {
  /* rotation logic */
  updateCurrentPlayer(data.currentPlayer);
  updateRotation(data.rotation);

  // if draw 4 or changeColor, then set color to chosen color and not playedCard.Color
  let updateColor = data.playedCard.color;
  if (data.playedCard.type == 'draw 4' || data.playedCard.type == 'changeColor'){
    updateColor = data.chosenColor;
  }

  setPile({
    number: data.playedCard.number,
    color: updateColor,
    type: data.playedCard.type
  });

  // update player display
  let numPlayersCards = data.numPlayersCards;
  let playerNum = await getPlayerNum(gameId);

  updatePlayers(playerNum, numPlayersCards);
});

channel.bind('special-draw', async data =>  {
  let playerNum = await getPlayerNum(gameId);

  if (playerNum != data.playerToDraw) return;

  addCard({ 
    id: data.drawnCard.id,
    number: data.drawnCard.number,
    color: data.drawnCard.color,
    type: data.drawnCard.type
  });
});

channel.bind('end-game', async data =>  {
  let endGameForm = document.getElementById('endGameForm');
  endGameForm.submit();
});

/*
 * Chat room bindings
 */
channel.bind('chat-msg', data => {
  let { username, message, timestamp } = data;

  const chatBox = document.getElementById('chat-messages');
  const div = document.createElement('div');

  div.classList.add('message');
  div.innerHTML = `<span> [${timestamp}]</span>
    <strong>${username}:</strong> ${message}`;
  chatBox.append(div);

  // scrolldown automatically
  chatBox.scrollTop = chatBox.scrollHeight;
});

