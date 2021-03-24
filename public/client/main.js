import {Card, getStartingDeck} from './card.js';

var hand = document.getElementById("hand");

// TODO: Remove when server requests implemented
var deck = getStartingDeck();

// Test: Draw 7
for (var i = 0; i < 7; i++) {
    // TODO: Replace with server request here
    var card = deck.pop(0);

    // Add generated card to hand
    var elem = card.createElement();
    hand.append(elem);
}
