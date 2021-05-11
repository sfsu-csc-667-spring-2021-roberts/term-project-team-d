import {createCardElement} from './card.js';

var handDiv = document.getElementById("hand");
var boardDiv = document.getElementById("board");
var deckDiv = null;
var pileDiv = null;

var handRef = {}
var dataRef = {}

/* URL for fetches */
//const baseUrl = 'http://localhost:3000/';

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

    /* change color button */
    let colorChooserDiv = document.getElementById('colorChooser');
    for (let child of Array.from(colorChooserDiv.children)) {
        console.log('child:', child);
        console.log(child.tagName);
      if (child.tagName == 'BUTTON') {
        //console.log('child:', child);
        child.addEventListener('click', setChosenColor);
      }
    }
}

/* changeColor function */
function setChosenColor(e) {
  let currentColorDiv = document.getElementById('currentColor');
  currentColorDiv.innerText = e.target.innerText; 
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
function addCard(cardData){
    // generate visual element
    var cardElem = createCardElement(cardData);
    handDiv.append(cardElem);

    //console.log('cardData in add', cardData);
    // generate link between visual element and cardData
    handRef[cardData.id] = cardElem;
    dataRef[cardElem] = cardData;

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
    delete dataRef[elem];
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
async function playCard(event){
    //var cardElem = event.srcElement.parentElement;
    var cardElem = event.target;
    //var cardData = Object.keys(handRef).find(key => handRef[key] === cardElem);
    var cardData = dataRef[cardElem];
    let cardId = cardData.id;
    console.log('cardData', cardData);
    
    if(cardData == null){
        console.log("Card " + cardElem + " has no reference!");
        return;
    }

    //console.log('cardData:', cardData);

    let color, colorDiv;
    if (cardData.type == 'changeColor' || cardData.type == 'draw 4') {
      colorDiv = document.getElementById('currentColor');
      color = colorDiv.innerText;
    }
    console.log('cardId and color', cardId, color);
    let playedCard = await fetchPlayCard(cardId, color);

  /* re-render discard pile */
  if (playedCard) {
    setPile({
      number: playedCard.number,
      color: playedCard.color,
      type: playedCard.type
    });

    /* remove card from hand */
    removeCard(playedCard.id);
  }
}

async function fetchPlayCard(cardData, color) {
  let playCardUrl = '/game/' + gameId + '/playCard';

  let response = await fetch(playCardUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      cardId: cardData,
      chosenColor: color
    })
  });
  response = await response.json(); 
  let { playedCard } = response;
  //console.log('result', result);
  console.log('After fetch playedCard:', playedCard);

  return playedCard;
  
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

  addCard({ 
      id: playedCard.id,
      number: playedCard.number,
      color: playedCard.color,
      type: playedCard.type
    });

}

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

  if (lastCard) {
    setPile({
      number: lastCard.number,
      color: lastCard.color,
      type: lastCard.type
    });
  }
}

async function changeColor() {


  let changeColor = '/game/' + gameId + '/getLastCard';

  const response = await fetch(fetchLastCardUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ gameId: gameId })
  });
  let lastCard = await response.json(); 


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
