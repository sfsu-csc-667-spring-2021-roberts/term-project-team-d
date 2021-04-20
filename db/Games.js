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



  static startGame(gameId) {
      Games.initializeCards(gameId);

      //shuffle cards:
      Games.shuffleDeck();
      // deal out cards

      //game.dealCards();
  }
 static dealCards() {

 }
  static async initializeCards(gameId) {
      let selectQuery = `SELECT id FROM cards`;
      let cards = await db.any(selectQuery);
      for (let i = 0; i < cards.length; i++) {
        let insertQuery = `INSERT INTO game_cards(card_status, game_id, card_id) 
          VALUES(0, ${gameId}, ${cards[i].id})`;
        db.none(insertQuery);
      }
    }

  dealCards() {
  }

  playerLeave() {
  }

  static shuffleDeck(){
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
    console.log (array)  
  }
  reShuffleDeck(){

  }
}

module.exports = Games;
