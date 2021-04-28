import {createCardElement} from './card.js';

var handDiv = document.getElementById("hand");
var boardDiv = document.getElementById("board");
var deckDiv = null;
var pileDiv = null;

var handRef = {}

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

    // TODO: add event listener here
}

/*
 * Remove a card (virtually and graphically) based on server message
 * PARAM - cardData - A card json receieved from server
 */
function removeCard(cardData){
    var id = cardData.id;

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
function playCard(cardElem){
    var cardData = Object.keys(handRef).find(key => handRef[key] === cardElem);
    
    if(cardData == null){
        console.log("Card " + cardElem + " has no reference!");
        return;
    }

    // TODO: send server request here
}

function initBoard(){
    deckDiv = createCardElement({"color":"black"});
    pileDiv = createCardElement({"color":"black"});

    boardDiv.append(deckDiv);
    boardDiv.append(pileDiv);
}

function setPile(cardData){
    var cardElem = createCardElement(cardData, false);
    pileDiv.replaceWith(cardElem);
}

addCard({
    number: 1,
    color: 'red',
    type: 'normal'
});

addCard({
    number: -1,
    color: 'black',
    type: 'draw4'
});

addCard({
    number: 8,
    color: 'yellow',
    type: 'skip'
});

addCard({
    number: 2,
    color: 'green',
    type: 'normal'
});

addCard({
    number: 2,
    color: 'blue',
    type: 'normal'
});

initBoard();

setPile({
    number: 2,
    color: 'blue',
    type: 'skip'
});

// TODO: establish socket connection
// TODO: get initial hand 
