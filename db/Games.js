let db = require('./connection');
let ActiveRecord = require('./ActiveRecord');

class Games extends ActiveRecord {
  GAME_ENDED = -1;
  GAME_STARTED = 0;
  GAME_PENDING = 1;

  id = -1;
  game = -1;
  username = '';
  currentPlayer = 1;

  /* START GAME */
  static async startGame(gameId) {
    await Games.initializeCards(gameId);
    await Games.shuffleDeck(gameId);
    await Games.dealCards(gameId);

    // setting started to 1
    let sql = `UPDATE games
      SET started = 1
      WHERE id = ${gameId}`;

    await db.none(sql);
  }


  // TODO Make sure game has not ended
  static getGameList() {
    let query = `SELECT game_users.game_id, COUNT(game_users.id) FROM game_users
      JOIN games ON games.id = game_users.game_id 
      GROUP BY game_users.game_id
      ORDER BY game_users.game_id ASC`;
    //let query = `SELECT id FROM games`
    return db.any(query);
  }

  // int gameId -> { username }
  static async getUsernames(gameId) {
    let query = `SELECT username FROM game_users
      JOIN users ON game_users.user_id = users.id
      WHERE game_id = ${gameId}`
    return db.any(query);
  }

  // int gameId -> int
  static async getNumPlayers(gameId) {
    let query = `SELECT COUNT(user_id)
    FROM game_users WHERE game_id = ${gameId}`;
    let  { count } = await db.one(query);
    return parseInt(count);
  }
  
  // gameId -> int
  static async isStarted(gameId) {
    let query = `SELECT started FROM games
      WHERE id = ${gameId}`

    let startedObj = await db.one(query);
    let started = startedObj.started;
    return started
  }
 
  endGame() {
    
  }

    static async initializeCards(gameId) {
      let selectQuery = `SELECT id FROM cards`;
      let cards = await db.any(selectQuery);
      for (let i = 0; i < cards.length; i++) {
        let insertQuery = `INSERT INTO game_cards(card_status, game_id, card_id) 
          VALUES(0, ${gameId}, ${cards[i].id})`;
        await db.none(insertQuery);
      }
    }

  static async dealCards(gameId) {
    //let's say we give each player 8 cards:
    let player = 1

    let cardId = `SELECT id FROM game_cards 
        WHERE card_status = 0
        AND game_id = ${gameId}
        ORDER BY card_order
        LIMIT 1`;

    for (let i = 1; i <=8*4; i++){
      
      let { id: cardToAssign } = await db.one(cardId)
      
      let updateCard = `UPDATE game_cards
      SET card_status = ${player}
      WHERE id = ${cardToAssign}
      AND game_id = ${gameId}`

      await db.none(updateCard);

      player = (player+1)% 5
      if (player == 0) {
        player = player + 1
      }
    }
  }

  playerLeave() {
  }

  static async shuffleDeck(gameId){
    // create the array cardsOrder in order from 1 to 60:
    let array = [];
    for (let i = 1; i <= 60; i++){
      array.push(i)
    }
    
     /* Randomize array in-place using Durstenfeld shuffle algorithm */
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    //console.log (array)
    
    let SelectQuery = `SELECT id FROM game_cards WHERE game_id = ${gameId}`
    let GameCardsIds = await db.any(SelectQuery)
    //console.log('gamecardsids', GameCardsIds)

    for (let i = 0; i <= 59; i++){
      let gameCardId = GameCardsIds[i].id
      let updateQuery = `UPDATE game_cards 
      SET card_order = ${array[i]} WHERE id = ${gameCardId}`;
      await db.none(updateQuery)
    }

    
  }
  static async reshuffle(gameId){


    // first, take all the cards from the played pile.
    let selectSQL = `SELECT id from game_cards
                  WHERE card_status = -1 AND game_id=${gameId}
                  AND id != (SELECT last_card FROM GAMES
                    WHERE id = ${gameId})`
    
    let pileCards = await db.any(selectSQL)
    // then, change their card_status to 0, before it was -1
    console.log(pileCards)
    for(let key in pileCards){
      console.log(pileCards[key])
      let updateSQL = `UPDATE game_cards
      SET card_status = 0
      WHERE game_id = ${gameId}
      AND id = ${pileCards[key].id}`

      await db.none(updateSQL)
    }

    // then, count how many cards we have in the deck now.

    let numberOfCardsInDeck = pileCards.length;

    // then do the same thing we did in shuffleDeck, but instead of creating an array of 60
    // numbers, we create an array of size(deck)
    // create the array cardsOrder in order from 1 to 60:
    let array = [];
    for (let i = 1; i <= numberOfCardsInDeck; i++){
      array.push(i)
    }



    // shuffle the numbers
    // assign them as order to the deck cards.

         /* Randomize array in-place using Durstenfeld shuffle algorithm */
         for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      //console.log (array)
    
  
      for (let i = 0; i <= array.length - 1; i++){
        let gameCardId = pileCards[i].id
        let updateQuery = `UPDATE game_cards 
        SET card_order = ${array[i]} WHERE id = ${gameCardId}`;
        await db.none(updateQuery)
      }

  }

  static async isValidCard(gameCardId, gameId) {
    // select color and number
    let sql = `SELECT number, color FROM game_cards
    JOIN cards ON game_cards.card_id = cards.id 
    WHERE game_cards.id = ${gameCardId}`;

    let result = await db.any(sql);
    const { number, color } = result[0];

    // get last played card
    sql = `SELECT last_card,last_color FROM games 
      WHERE id = ${gameId}`;

    result = await db.any(sql);
    let {last_card: lastCard, last_color: lastColor} = result[0];
    //console.log(lastCard, lastColor);

    sql = `SELECT number, color, type FROM game_cards
      JOIN cards ON game_cards.card_id = cards.id
      WHERE game_cards.id = ${lastCard}`;

    result = await db.any(sql);
    const { 
      number: pileNumber, 
      color: pileColor, 
      type: pileType 
    } = result[0];

    // this means the player chose a special card that can be played anyway
    if (color == 'none') {
      return true;
    }
    console.log('COLOR == None');

    // TODO TEST DRAW 4
    if (pileType == 'changeColor' || pileType == 'draw 4') {
      if (color == lastColor) return true;
      else return false;
    }
    console.log('pileType == changeColor');

    // this means that the last played card is a color special card
    if (number == -1) {
      return color == pileColor
    }
    console.log('number == -1');

    console.log('pileColor:', pileColor, 'color:', color);

    // this means that card player is a regular card.
    return (pileNumber == number || pileColor == color)

  }

    static async nextPlayer(gameId) {
      // grabbing clockwise
      let clockwiseSQL = `SELECT clockwise FROM games
                          WHERE id = ${gameId};`
              
      let {clockwise : rotation} = await db.one(clockwiseSQL)

      let getCurrentPlayer = `SELECT current_player FROM games
        WHERE id = ${gameId}`;
      let { current_player: currentPlayer} = await db.one(getCurrentPlayer);
      let nextPlayer = (currentPlayer + rotation) % 5;
      if (nextPlayer == 0 && rotation == 1) nextPlayer = 1;
      else if (nextPlayer == 0 && rotation == -1) nextPlayer = 4;
      // udpating current player
      let updateCurrentPlayer = `UPDATE games
                                 SET current_player = ${nextPlayer}
                                 WHERE id = ${gameId}`
      
      await db.none(updateCurrentPlayer)

    }

    static async updateCardStatus(gameCardId) {
      let sql = `UPDATE game_cards
        SET card_status = -1 
        WHERE id = ${gameCardId}`;
      console.log(sql);
      await db.none(sql);
      console.log('AFTER updateCardStatus inside updatecardstatus');
    }
    static async updateLastCard(gameCardId,gameId) {
      let sql = `UPDATE games
                 SET last_card = ${gameCardId}
                 WHERE id = ${gameId}`
      console.log(sql);
      await db.none(sql)
    }

  static async getNumPileCards(gameId) {
    let sql = `SELECT COUNT(*) FROM game_cards
      WHERE game_id = ${gameId} AND 
      card_status = -1`;

    let { count } = await db.one(sql);
    //console.log(count);
    return count;
  }

  static async getCurrentPlayer(gameId) {
    let sql = `SELECT current_player
      FROM games
      WHERE id = ${gameId}`;

    let { current_player } = await db.one(sql);
    return current_player;
  }

  static async getCard(gameCardId) {
    let sql = `SELECT game_cards.id, cards.color, cards.number, cards.type
      FROM game_cards
      JOIN cards ON game_cards.card_id = cards.id
      WHERE game_cards.id = ${gameCardId}`;

    return await db.one(sql);
  }

  static async getLastCard(gameId){
    let selectGameCardIdSql = `SELECT last_card FROM games
                               WHERE id = ${gameId}`
    let {last_card} = await db.one(selectGameCardIdSql);
    let selectSQL = `SELECT game_cards.id, cards.color, cards.number, cards.type
    FROM game_cards
    JOIN cards ON game_cards.card_id = cards.id
    WHERE game_cards.id = ${last_card}`

    let lastCardObject = await db.one(selectSQL)

    return lastCardObject;
  }

  static async getRotation(gameId) {
    let clockwiseSQL = `SELECT clockwise FROM games
                          WHERE id = ${gameId};`
              
    let {clockwise : rotation} = await db.one(clockwiseSQL)
    return rotation;
  }

} // end of Games class

module.exports = Games;
