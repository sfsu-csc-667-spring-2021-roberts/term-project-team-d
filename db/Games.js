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



  static async startGame(gameId) {
      await Games.initializeCards(gameId);

      //shuffle cards:
      await Games.shuffleDeck(gameId);
      // deal out cards

      Games.dealCards(gameId);
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
    for (let i = 1; i <=8*4; i++){
      let cardId = `SELECT id FROM game_cards 
        WHERE card_status = 0
        AND game_id = ${gameId}
        ORDER BY card_order
        LIMIT 1`

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
  reShuffleDeck(){

  }

  static async isValidCard(gameCardId, gameId) {
    //TODO: ADD case where last_Card is changeCOLOR.

    // need color and number
    let sql = `SELECT number, color FROM game_cards
    JOIN cards ON game_cards.card_id = cards.id 
    WHERE game_cards.id = ${gameCardId}`;

    const { number, color } = await db.any(sql);
    

    //get last played card
    sql = `SELECT last_card,last_color FROM games 
      WHERE id = ${gameId}`;

    let {last_card: lastCard, last_color: lastColor} = await db.any(sql);

    sql = `SELECT number, color,type FROM game_cards
      JOIN cards ON game_cards.card_id = cards.id
      WHERE id = ${lastCard}`;

    // TODO play any cards need to get through
    const { number: pileNumber, color: pileColor, type: pileType } = await db.any(sql);

    // this means the player chose a special card that can be played anyway
    if (color == 'none') {
      return true;
    }

    // this checks if last player card was a changeColor card.
    if (pileType == 'changeColor') {
      if (color == lastColor) return true;
      else return false;
    }

    // this means that the last played card is a color special card
    if (number == -1) {
      return color == pileColor
    }

    // this means that card player is a regular card.
    return (pileNumber == number || pileColor == color)

  }

    static async nextPlayer(gameId) {
      // TODO go to next player
      // grabbing clockwise
      let clockwiseSQL = `SELECT clockwise FROM games
                          WHERE id = ${gameId};`
              
      let {clockwise : rotation} = await db.one(clockwiseSQL)

      // udpating current player
      let updateCurrentPlayer = `UPDATE games
                                 SET current_player = current_player + ${rotation} 
                                 WHERE id = ${gameId}`
      
      await db.none(updateCurrentPlayer)

    }

    static async updateCardStatus(gameCardId) {
      let sql = `UPDATE game_cards
        SET card_status = -1 
        WHERE gameCardId = ${gameCardId}`;
      

      await db.none(sql);
    }
    static async updateLastCard(gameCardId,gameId) {
      let sql = `UPDATE games
                 SET last_card = ${gameCardId}
                 WHERE id = ${gameId}`
      await db.none(sql)
    }



}

module.exports = Games;
