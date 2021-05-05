import {createCardElement} from './card.js';

var handDiv = document.getElementById("hand");
var boardDiv = document.getElementById("board");
var deckDiv = null;
var pileDiv = null;

var handRef = {}

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
function playCard(event){
    //var cardElem = event.srcElement.parentElement;
    var cardElem = event.target;
    var cardData = Object.keys(handRef).find(key => handRef[key] === cardElem);
    
    if(cardData == null){
        console.log("Card " + cardElem + " has no reference!");
        return;
    }

    console.log("Playing " + cardData);

    var request = {
        "card" : cardData,
        "player" : null
    }

    // TODO: send server request here
}

/*
 * Request the server for a new card.
 * If OK response, add new card to hand.
 * If fail or no response, display failed msg
 */
function drawCard(event){
    console.log("Drawing x1 card");

    var request = {
        "player" : null
    }

    // TODO: send server request here
}

initBoard();

// TODO: replace with server init pile card
setPile({
    number: 2,
    color: 'blue',
    type: 'skip'
});

// TODO: replace with server draw 7 cards
addCard({
    id: 1,
    number: 1,
    color: 'red',
    type: 'normal'
});

addCard({
    id: 3,
    number: -1,
    color: 'black',
    type: 'draw4'
});

addCard({
    id: 4,
    number: 8,
    color: 'yellow',
    type: 'skip'
});

addCard({
    id: 5,
    number: 2,
    color: 'green',
    type: 'normal'
});

addCard({
    id: 6,
    number: 2,
    color: 'blue',
    type: 'normal'
});

// TODO: establish socket connection
// TODO: get initial hand 
