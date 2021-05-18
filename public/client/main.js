import {createCardElement} from './card.js';
import {notify, notifyInit, soundsInit} from './notifications.js';

var handDiv = document.getElementById("hand");
var boardDiv = document.getElementById("board");
var deckDiv = null;
var pileDiv = null;
let chosenColor = 'yellow';

var handRef = {}

/* URL for fetches */
const baseUrl = 'http://localhost:3000/';

/* get gameId from URL */
let url = window.location.href;
url = url.split('/');
//let gameId = url[5].charAt(0);
let gameId = url[5];

gameId = gameId.split('?')[0];

console.log('URL', url, ' gameId ', gameId);


// Create default Deck and Pile cards, start event listeners 
function initBoard(){
    deckDiv = createCardElement({"color":"black"});
    pileDiv = createCardElement({"color":"black"});

    boardDiv.append(deckDiv);
    boardDiv.append(pileDiv);

    deckDiv.addEventListener("click", drawCard);

    /* change color button */
    let colorChooserDiv = document.getElementById('choose-colors');
    for (let child of Array.from(colorChooserDiv.children)) {
        //console.log('child:', child);
        //console.log(child.tagName);
      if (child.tagName == 'BUTTON') {
        //console.log('child:', child);
        child.addEventListener('click', setChosenColor);
      }
    }
}

/* changeColor function */
function setChosenColor(e) {
  let currentColorDiv = document.getElementById('currentColor');
  let colorChooser = document.getElementById('choose-colors');
  let color = e.target.innerText;

  currentColorDiv.innerText = color; 
  chosenColor = color;

  colorChooser.classList = '';
  colorChooser.classList.add("card-" + color);
  notify('ok', 'selected color', 'updated selected color to ' + color);
}

/*
 * Set pile card (graphic) based on card data
 */
export function setPile(cardData){
    var cardElem = createCardElement(cardData, false);
    pileDiv.replaceWith(cardElem);
    pileDiv = cardElem;
}

/* 
 * Add a new card to your hand
 * PARAM cardData - A card json received from server
 */
export function addCard(cardData){
    // generate visual element
    var cardElem = createCardElement(cardData);
    handDiv.append(cardElem);

    // generate link between visual element and cardData
    handRef[cardData.id] = cardElem;

    cardElem.addEventListener("click", playCard);
}

/*
 * Remove a card (virtually and graphically) based on server message
 * PARAM - cardData - A card json receieved from server
 */
function removeCard(id){
    //console.log('handRef', handRef);

    // Remove visual element
    var elem = handRef[id];
    elem.remove();

    // Remove virtual data
    delete handRef[id];
}

/*
 * Request the server to play a card.
 * If OK response, remove card and update game state.
 * If fail or no response, display failed msg
 * PARAM - cardElem - Element on page which refers to card being played
 */
function playCard(event){
    //var cardElem = event.srcElement.parentElement;
    var cardElem = event.target;
    var cardData = Object.keys(handRef).find(key => handRef[key] === cardElem);
    
    if(cardData == null){
        console.log("Card " + cardElem + " has no reference!");
        return;
    }

    //console.log("Playing " + cardData);
    fetchPlayCard(cardData);
}

/*
 * Request the server for a new card.
 * If OK response, add new card to hand.
 * If fail or no response, display failed msg
 */
async function drawCard(event){
    //console.log("Drawing x1 card");

    var request = {
        "player" : null
    }

  let drawCardUrl = '/game/' + gameId + '/drawCard';
  const response = await fetch(drawCardUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body data type must match "Content-Type" header
    body: JSON.stringify({ msg: 'drawing a card' }) 
  });

  let { playedCard } = await response.json();
  //console.log('playedCard:', playedCard);

  if(playedCard == undefined){
    notify('err', 'error', ('Error drawing the card'));
    return;
  }

  addCard({ 
      id: playedCard.id,
      number: playedCard.number,
      color: playedCard.color,
      type: playedCard.type
    });

}

/* === Chat Room (Pressing enter) ======*/
const chatForm = document.getElementById('chat-form');
chatForm.autocomplete = "off";
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  if(msg.length == 0) return;
  let chatUrl = '/game/' + gameId + '/chatMessage';

  let response = await fetch(chatUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msg: msg
    }),
  });
  e.target.elements.msg.value = '';
});

async function getPlayerCards(gameId) {
  let getPlayerHandUrl = '/game/' + gameId + '/getPlayerHand';

  const response = await fetch(getPlayerHandUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body data type must match "Content-Type" header
    body: JSON.stringify({ msg: 'From client get Player Hand' }) 
  });
  
  // parses JSON response into native JavaScript objects
  let playerCards = await response.json(); 
  //console.log(playerCards);
  return playerCards
}

function addCards(playerCards) {
  //console.log(playerCards);
  for (let i = 0; i < playerCards.length; i++) {
    addCard({ 
      id: playerCards[i].id,
      number: playerCards[i].number,
      color: playerCards[i].color,
      type: playerCards[i].type
    });
  }
}

async function fetchPlayCard(cardData) {
  let playCardUrl = '/game/' + gameId + '/playCard';

  let response = await fetch(playCardUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body data type must match "Content-Type" header
    body: JSON.stringify({
      cardId: cardData,
      chosenColor: chosenColor
    })
  });
  response = await response.json(); 

  let { playedCard } = response;

  if (playedCard) {
    setPile({
      number: playedCard.number,
      color: playedCard.color,
      type: playedCard.type
    });

    removeCard(playedCard.id);
  }else{
    notify('err', 'error', 'could not play card: ' + response.msg);
  }
}

async function getPlayerNum(gameId){
  let url = '/game/'+gameId+'/getPlayerNum';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}

async function getPlayerName(playerNum){
  let url = '/users/'+playerNum+'/name';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}

async function handleLastCard(gameId) {
  let fetchLastCardUrl = '/game/' + gameId + '/getLastCard';

  const response = await fetch(fetchLastCardUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ gameId: gameId })
  });
  let { lastCard, chosenColor } = await response.json(); 

  if (lastCard) {
    if (lastCard.type == 'draw 4' ||
    lastCard.type == 'changeColor') {
      setPile({
        number: lastCard.number,
        color: chosenColor,
        type: lastCard.type
      });
  } else {
    setPile({
      number: lastCard.number,
      color: lastCard.color,
      type: lastCard.type
    });
  }
}
}

async function notifyJoinGame(gameId){
  let playerNum = await getPlayerNum(gameId);
  notify('ok', 'welcome', ('welcome to the game, player ' + playerNum.playerNum));
}

/* =================================*/
/* ============== MAIN =============*/
/* =================================*/

async function main(gameId) {
  initBoard();
  let playerCards = await getPlayerCards(gameId);

  addCards(playerCards);
  handleLastCard(gameId);

  notifyInit();
  soundsInit();
  await notifyJoinGame(gameId);
}

main(gameId);
