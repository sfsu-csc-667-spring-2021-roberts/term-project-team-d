const db = require('./connection');
const ActiveRecord = require('./ActiveRecord');
const Games = require('./Games');

class Game_users extends ActiveRecord {
  id = -1;
  game = -1;
  username = '';

  // userId, gameId -> boolean
  static async isJoined(userId, gameId) {
    let query = `SELECT COUNT(*) FROM game_users 
      WHERE user_id = ${userId} AND game_id = ${gameId}`

    let { count } = await db.one(query)
    let joined = parseInt(count);
    
    return joined
  }

  // convert to player cards status change
  drawFirstNCards(player, n) {
  }

  // userId, gameId -> void
  static async joinGame(gameId, userId) {
    // DOUBLE CHECK if already joined
    let isJoined = await Game_users.isJoined(userId, gameId);
    if (isJoined)
      return 
    //get current players and increment for player_num
    let { count: numPlayers } = await Games.getNumPlayers(gameId);

    // TODO numPlayers logic is broken BRB 5 minutes
    let query = `INSERT INTO game_users(game_id, user_id, player_num, winner)
      VALUES(${gameId}, ${userId}, ${++numPlayers}, 0)`;

    db.none(query);
  }

  // userId, gameId -> void
  static async leaveGame(gameId, userId) {
    let started = await Games.isStarted(gameId);

    if (!started) {
      let query = `DELETE FROM game_users
        WHERE user_id = ${userId} AND game_id = ${gameId}
        RETURNING player_num`;
      let playerNum = await db.one(query);
      // DECREMENT game_users that are > user we deleted
      //query = `UPDATE game_users SET
    } else {
      console.log('ERROR leaveGame: cant leave game already started');
    }
  }

  drawCard() {
  }

  playCard() {
  }

}

module.exports = Game_users;
