export const specialTypes = {
    SKIP:      101,
    REVERSE:   102,
    PLUS2:     103,
    CHOOSE1:   104,
    CHOOSE4:   105,
}

export class Card {
    constructor(color, number) {
        this.color = color;
        this.number = number;
    }

    createElement() {
        var btn = document.createElement("div");

        btn.innerText = String(this.number);
        btn.style.backgroundColor = String(this.color);

        for (var key in specialTypes) {
            if(specialTypes[key] != this.number) continue;

            btn.innerText = key;
        }

        if(this.color == null){
            btn.style.backgroundColor = "black";
            btn.style.color = "white";
        }
        
        btn.classList.add('card');

        return btn;
    }
}

// Return array containing all UNO cards
export function getStartingDeck() {
    deck = [];

    ["red", "green", "blue", "yellow"].forEach(handleColor);

    function handleColor(value, index, array) {
        // x1 zero
        deck.push(new Card(value, 0));

        // x2 numbers 1-9
        // x2 reverse, skip, and plus2
        for (var i = 0; i < 2; i++) {
            for (var n = 1; n <= 9; n++) {
                deck.push(new Card(value, n));
            }

            deck.push(new Card(value, specialTypes.SKIP));
            deck.push(new Card(value, specialTypes.REVERSE));
            deck.push(new Card(value, specialTypes.PLUS2));
        }

        // x1 of choose 1, choose 4
        deck.push(new Card(null, specialTypes.CHOOSE1));
        deck.push(new Card(null, specialTypes.CHOOSE4));
    }

    shuffle(deck);
    return deck;
}

// Fisher–Yates shuffle algorithm, implemented in JS
// Algo taken from: stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
export function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export default Card;
