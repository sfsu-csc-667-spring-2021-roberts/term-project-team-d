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
    // CHECK if already joined
    let isJoined = await Game_users.isJoined(userId, gameId);
    if (isJoined)
      return 
    //get current players and increment for player_num
    let numPlayers = await Games.getNumPlayers(gameId);

    let query = `INSERT INTO game_users(game_id, user_id, player_num, winner)
      VALUES(${gameId}, ${userId}, ${++numPlayers}, 0)`;

    await db.none(query);
  }

  // userId, gameId -> void
  static async leaveGame(gameId, userId) {
    let started = await Games.isStarted(gameId);

    if (!started) {
      let {count } = await Games.getNumPlayers(gameId)
      //console.log("===========>",count)
      let query = `DELETE FROM game_users
        WHERE user_id = ${userId} AND game_id = ${gameId}
        RETURNING player_num`;
      let playerNum = await db.one(query);

      //console.log("playerNum Object ===>",playerNum)
      // DECREMENT game_users that are > user we deleted
      // query = `UPDATE game_users SET

      for (let i = playerNum.player_num + 1; i <= count; i++) {
        let query2 = await `UPDATE game_users 
                 SET player_num = ${i-1}
                 WHERE 
                      game_id = ${gameId} AND
                      player_num = ${i}`
        console.log(query2)
        await db.none(query2)
        console.log("=========> inside the loop ");
        
      }
      //console.log("Number of players =======>", await Games.getNumPlayers(gameId))
      

    } else {
      console.log('ERROR leaveGame: cant leave game already started');
    }
  }
  
  static async getCardsInHand(gameId, userId) {

    let playerNum = Game_users.getPlayerNumber(gameId, userId);

    let query = `SELECT * FROM game_cards
    JOIN cards ON game_cards.card_id = cards.id
    WHERE game_cards.card_status = ${player_num} AND
    game_cards.game_id = ${game_id}`;



    let card_ids = await db.any(query)

    console.log(card_ids);
  }

  static async getPlayerNumber(gameId,userId) {
    let query = `SELECT player_num FROM game_users
    WHERE game_id = ${gameId}
    AND user_id = ${userId}`

    let { player_num : playerNum } = await db.one(query);

    console.log(playerNum)

    return playerNum
  }

  //I assume, getting the 1st card from deck.
  drawCard() {
    let selectQuery = `SELECT id FROM cards`;
    let cards = [];
    cards = await db.any(selectQuery);

    return cards.pop();
  }
  
  /**
   * 
   * @param userID the id that needs to deal
   * @param {*} card a card send from client
   */
  playCard(userID, card) {
    //TODO: delete this card from a user, you may need to go through cards[]
    
  }
}

module.exports = Game_users;
