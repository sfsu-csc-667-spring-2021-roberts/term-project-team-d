let db = require('./connection');
let ActiveRecord = require('./ActiveRecord');

class Game extends ActiveRecord {
  id = -1;
  game = -1;
  username = '';

  static getGameList() {
    let query = `SELECT player.game_id, COUNT(player.id) FROM player
      JOIN game ON game.id = player.game_id 
      GROUP BY player.game_id
      ORDER BY player.game_id ASC`;
    return db.any(query);
  }
 
  // possibly dangerous way of linking game to player
  static async createGame() {
    await db.none(`INSERT INTO game DEFAULT VALUES`);
    let temp = await db.one(`SELECT id FROM game ORDER BY id DESC LIMIT 1`);
    db.none(`INSERT INTO player(game_id) VALUES(${temp.id})`);
  }

  endGame() {
    initializeCards();
    // deal out cards
    dealCards();
  }

  initializeCards() {
  }

  dealCards() {
  }

  playerLeave() {
  }
}

module.exports = Game;
