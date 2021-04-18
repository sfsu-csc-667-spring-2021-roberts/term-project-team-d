const db = require('./connection');
const ActiveRecord = require('./ActiveRecord');
const Games = require('./Games');

class Game_users extends ActiveRecord {
  id = -1;
  game = -1;
  username = '';

  static async joinedAndNotStarted(userId, gameId) {
    let query = `SELECT COUNT(*) FROM game_users 
      WHERE user_id = ${userId} AND game_id = ${gameId}`
    let query2 = `SELECT started FROM games WHERE id = ${gameId}`

    let { count } = await db.one(query)
    let joined = parseInt(count);
    //console.log("joined: ", joined);
    let { started } = await db.one(query2)
    //console.log("started", started);

    if (started == 0) started = false
    else started = true

    return joined && !started
  }

  // convert to player cards status change
  drawFirstNCards(player, n) {
  }

  // userId, gameId -> void
  static async joinGame(gameId, userId) {
    //get current players and increment for player_num
    let { count: numPlayers } = await Games.getNumPlayers(gameId);
    console.log(numPlayers);

    let query = `INSERT INTO game_users(game_id, user_id, player_num, winner)
      VALUES(${gameId}, ${userId}, ${++numPlayers}, 0)`;

    db.none(query);
  }

  // userId, gameId -> void
  static leaveGame(gameId, userId) {
    query = `DELETE FROM game_users
      WHERE user_id = ${userId} AND game_id = ${gameId}`
    db.none(query);
  }

  drawCard() {
  }

  playCard() {
  }

}

module.exports = Game_users;
