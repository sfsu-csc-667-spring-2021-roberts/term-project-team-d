import { setPile, addCard } from './main.js';

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

/* ======= drawCard ======== */
channel.bind('draw-card', async data =>  {
  console.log('inside the draw-card bind')
  //fetch the player num.
  let url = '/game/'+gameId+'/getPlayerNum';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  let { playerNum } = await response.json();
  //console.log('playerNum object: '+ playerNum);


  //re-arange the array neighbors.
  let numPlayersCards = data.numPlayersCards
  
  let neighbors = getarrangement(playerNum, numPlayersCards);

  //console.log(neighbors)
  let topPlayer = document.getElementById('p2Cards');
  topPlayer.innerHTML =  'number of cards: '+ neighbors[1].count
  //update left div
  let leftPlayer = document.getElementById('p3Cards');
  leftPlayer.innerHTML =  'number of cards: '+ neighbors[0].count
  //update left div
  let rightPlayer = document.getElementById('p4Cards');
  rightPlayer.innerHTML =  'number of cards: '+ neighbors[2].count

})
/* ======= playCard ======== */
channel.bind('play-card', async data =>  {
  /* rotation logic */

  let rotation = data.rotation == 1 ? 'clockwise' : 'counterclockwise'

  //console.log('inside play-card binding', data.currentPlayer);
  let middleBoard = document.getElementById('boardStatus');
  middleBoard.innerHTML =  'Current Player: ' + data.currentPlayer +  
  '  Rotation: ' + rotation;
  //update top div
  //fetch the player num.
  let url = '/game/'+gameId+'/getPlayerNum';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  let { playerNum } = await response.json();
  //console.log('playerNum object: '+ playerNum);

  // if draw 4 or changeColor, then set color to chosen color and not playedCard.Color
  if (data.playedCard.type == 'draw 4' || data.playedCard.type == 'changeColor'){
    setPile({
      number: data.playedCard.number,
      color: data.chosenColor,
      type: data.playedCard.type
    });
  } else {
  /* ===== BROADCAST DISCARD PILE ======= */
  setPile({
      number: data.playedCard.number,
      color: data.playedCard.color,
      type: data.playedCard.type
    });
  }

  /* ===== BROADCAST NUMBER OF CARDS FOR EACH PLAYER ======= */
  //re-arange the array neighbors.
  let numPlayersCards = data.numPlayersCards
  
  let neighbors = getarrangement(playerNum, numPlayersCards);

  //console.log(neighbors)
  let topPlayer = document.getElementById('p2Cards');
  topPlayer.innerHTML =  'number of cards: '+ neighbors[1].count
  //update left div
  let leftPlayer = document.getElementById('p3Cards');
  leftPlayer.innerHTML =  'number of cards: '+ neighbors[0].count
  //update left div
  let rightPlayer = document.getElementById('p4Cards');
  rightPlayer.innerHTML =  'number of cards: '+ neighbors[2].count

});

/* draw special card */
/*
pusher.trigger("game" + gameId, "special-draw", {
  drawnCard: cardObject,
  playerToDraw: playerToDraw
});
*/
channel.bind('special-draw', async data =>  {
    //fetch the player num.
    let url = '/game/'+gameId+'/getPlayerNum';
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    let { playerNum } = await response.json();

    if (playerNum == data.playerToDraw) {
      addCard({ 
        id: data.drawnCard.id,
        number: data.drawnCard.number,
        color: data.drawnCard.color,
        type: data.drawnCard.type
      });
    }

});

channel.bind('end-game', async data =>  {
let url = '/game/'+gameId+'/endGame';
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          winner: data.winner
        }),
    });
});

  /* ========= Helper Functions =========*/
function getarrangement(playerNum, numPlayersCards) {
  let neighbors = [];

  if (playerNum == '1') {
    neighbors.push(numPlayersCards[1])
    neighbors.push(numPlayersCards[2])
    neighbors.push(numPlayersCards[3])

  } else if (playerNum == '2') {
    neighbors.push(numPlayersCards[2])
    neighbors.push(numPlayersCards[3])
    neighbors.push(numPlayersCards[0])
  } else if (playerNum == '3') {
    neighbors.push(numPlayersCards[3])
    neighbors.push(numPlayersCards[0])
    neighbors.push(numPlayersCards[1])
  } else {
    neighbors.push(numPlayersCards[0])
    neighbors.push(numPlayersCards[1])
    neighbors.push(numPlayersCards[2])
  }
  return neighbors;

}

