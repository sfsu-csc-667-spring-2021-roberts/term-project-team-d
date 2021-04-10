let db = require('./connection');
let ActiveRecord = require('./ActiveRecord');

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

  joinGame() {
  }

  drawCard() {
  }

  playCard() {
  }

}

module.exports = Game_users;
