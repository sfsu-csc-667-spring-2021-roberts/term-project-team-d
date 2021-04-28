// Special symbols used in non-number cards
const Type = {
    normal : {rank : "", symbol : ""},
    skip : {rank : "🚫", symbol : "🚫"},
    reverse : {rank : "⇄", symbol : "⇄"},
    draw2 : {rank : "+2", symbol : "⧉"},
    draw4 : {rank : "+4", symbol : "⧉"},
    chooseColor : {rank : "⨁", symbol : "⨁"}
}

/* 
 * Process card message json {} into Card object
 * generate HTML elements from Card Objects
 * style HTML elements based on Object properties
 *
 * PARAM - cardData - card json to be converted into graphics
 * PARAM - selectable - whether or not card will hilight on hover
 */
export function createCardElement(cardData, selectable=true){
    // Create base card element
    var card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("card-" + cardData.color);

    if(selectable){
        card.classList.add("grow");
        card.setAttribute("style", "cursor:pointer");
    }

    // Create rank and symbol subelements
    var rank = document.createElement("div");
    var symbol = document.createElement("div");
    rank.classList.add("card-txt");
    symbol.classList.add("card-symbol");

    card.append(rank);
    card.append(symbol);

    // Set rank & symbol text
    var type = Type[cardData.type];

    if(type == null){
        return card;
    }

    rank.innerText = type.rank;
    symbol.innerText = type.symbol;

    if(cardData.type == 'normal'){
        rank.innerText = cardData.number;
        symbol.innerText = cardData.number;
    }

    return card;
}
