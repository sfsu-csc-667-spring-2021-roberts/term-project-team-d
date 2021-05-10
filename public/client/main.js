import {createCardElement} from './card.js';

var handDiv = document.getElementById("hand");
var boardDiv = document.getElementById("board");
var deckDiv = null;
var pileDiv = null;

var handRef = {}

/* URL for fetches */
const baseUrl = 'http://localhost:3000/';

/* get gameId from URL */
let url = window.location.href;
url = url.split('/');
let gameId = url[5].charAt(0);
//console.log('gameId:', gameId);

/*
 * Create default Deck and Pile cards, start event listeners 
 */
function initBoard(){
    deckDiv = createCardElement({"color":"black"});
    pileDiv = createCardElement({"color":"black"});

    boardDiv.append(deckDiv);
    boardDiv.append(pileDiv);

    deckDiv.addEventListener("click", drawCard);
}

/*
 * Set pile card (graphic) based on card data
 */
function setPile(cardData){
    var cardElem = createCardElement(cardData, false);
    pileDiv.replaceWith(cardElem);
    pileDiv = cardElem;
}

/* 
 * Add a new card to your hand
 * PARAM cardData - A card json received from server
 */
function addCard(cardData){
    // generate visual element
    var cardElem = createCardElement(cardData);
    handDiv.append(cardElem);

    // generate link between visual element and cardData
    handRef[cardData.id] = cardElem;

    cardElem.addEventListener("click", playCard);
}
/*
 * REMOVE ALL CARDS
 */
function removeAllCards(){
  // STEP 1 - remove all elements
  // STEP 2 - clear the handref
}

/*
 * Remove a card (virtually and graphically) based on server message
 * PARAM - cardData - A card json receieved from server
 */
function removeCard(id){

    // Check if card exists!
    if(!handRef.has(id)){
        console.log("Card " + cardData + " not found!");
        return;
    }

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
    console.log("Drawing x1 card");

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

}

async function getPlayerCards(gameId) {
  let getPlayerHandUrl = baseUrl + 'game/' + gameId + '/getPlayerHand';

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
  let playCardUrl = baseUrl + 'game/' + gameId + '/playCard';

  const response = await fetch(playCardUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body data type must match "Content-Type" header
    body: JSON.stringify({ cardId: cardData })
  });
  let result = await response.json(); 
  let { playedCard } = result;
  //console.log('result', result);
  //console.log('playedCard:', playedCard);
  if (playedCard) {
    setPile({
      number: playedCard.number,
      color: playedCard.color,
      type: playedCard.type
    });
  }
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
  let lastCard = await response.json(); 

  setPile({
    number: lastCard.number,
    color: lastCard.color,
    type: lastCard.type
  });
}

/* =================================*/
/* ============== MAIN =============*/
/* =================================*/

async function main(gameId) {
  initBoard();
  let playerCards = await getPlayerCards(gameId);
  addCards(playerCards);
  handleLastCard(gameId);
}

main(gameId);

// TODO: replace with server init pile card
//// TODO: replace with server draw 7 cards
// TODO: establish socket connection
// TODO: get initial hand 
