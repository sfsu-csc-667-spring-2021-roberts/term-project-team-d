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

  initializeCards() {
  }

  dealCards() {
  }

  playerLeave() {
  }

  shuffleDeck(){

  }
  reShuffleDeck(){

  }
}

module.exports = Games;
