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

  static getNumPlayers(gameId) {
    let query = `SELECT COUNT(user_id)
    FROM game_users WHERE game_id = ${gameId}`
    return db.one(query);
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

  initializeCards() {
  }

  dealCards() {
  }

  playerLeave() {
  }

  static async shuffleDeck(){
    let queryCards =`SELECT * FROM cards`
    let cardArr = await db.one(queryCards);
    
    function shuffleCardArr(arr){
      for (let i = 0; i < arr.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];        
      }
    }
    shuffleCardArr(cardArr);
  }

  // I dont understand reShuffle, so I let it be
  static async reShuffleDeck(){
    
  }
}

module.exports = Games;
