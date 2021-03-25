let db = require('./connection');
let ActiveRecord = require('./ActiveRecord');

class Game extends ActiveRecord {
  GAME_ENDED = -1;
  GAME_STARTED = 0;
  GAME_PENDING = 1;

  id = -1;
  game = -1;
  username = '';
  currentPlayer = 1;

  // TODO Make sure game has not ended
  static getGameList() {
    let query = `SELECT player.game_id, COUNT(player.id) FROM player
      JOIN game ON game.id = player.game_id 
      GROUP BY player.game_id
      ORDER BY player.game_id ASC`;
    return db.any(query);
  }
 



  endGame() {
    
  }

  initializeCards() {
  }

  dealCards() {
  }

  playerLeave() {
  }
}

module.exports = Game;
