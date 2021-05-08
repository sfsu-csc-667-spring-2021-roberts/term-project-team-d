const db = require('./connection');
const ActiveRecord = require('./ActiveRecord');
const Games = require('./Games');

class Game_users extends ActiveRecord {
  id = -1;
  game = -1;
  username = '';

  static async playCard(gameCardId, gameId) {
    // First check if card is able to be played (color, number)
    let isValidCard;
    if (await Games.getNumPileCards(gameId) == 0) {
      isValidCard = true;
    } else {
      isValidCard = await Games.isValidCard(gameCardId, gameId);
    }

    console.log('AFTER CARD VALIDATION', isValidCard);

    if (isValidCard) {
      await Game_users.activateCardEffect(gameCardId, gameId);
      console.log('AFTER activate card effect');
      await Games.updateCardStatus(gameCardId);
      console.log('AFTER update card status');
      await Games.nextPlayer(gameId);
      console.log('AFTER next player');
      await Games.updateLastCard(gameCardId, gameId)
      console.log('AFTER update last card');

      // last card
      let cardObject = await Games.getCard(gameCardId);
      return cardObject;
    } else {
      // not valid, do nothing
      return 'invalid card';
    }
  }

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
    console.log('INSIDE LEAVE GAME ORM');
    let started = await Games.isStarted(gameId);
    console.log('started:', started);

    if (!started) {
      let count  = await Games.getNumPlayers(gameId)
      console.log("===========>", count)
      let query = `DELETE FROM game_users
        WHERE user_id = ${userId} AND game_id = ${gameId}
        RETURNING player_num`;
      let playerNum = await db.one(query);

      console.log("playerNum Object ===>",playerNum)
      // DECREMENT game_users that are > user we deleted
      // query = `UPDATE game_users SET

      for (let i = playerNum.player_num + 1; i <= count; i++) {
        let query2 = await `UPDATE game_users 
                 SET player_num = ${i-1}
                 WHERE 
                      game_id = ${gameId} AND
                      player_num = ${i}`
        //console.log(query2)
        await db.none(query2)
        //console.log("=========> inside the loop ");
        
      }
      //console.log("Number of players =======>", await Games.getNumPlayers(gameId))
      

    } else {
      console.log('ERROR leaveGame: cant leave game already started');
    }
  }
  
  static async getCardsInHand(gameId, userId) {

    let playerNum = await Game_users.getPlayerNumber(gameId, userId);

    let query = `SELECT * FROM game_cards
    JOIN cards ON game_cards.card_id = cards.id
    WHERE game_cards.card_status = ${playerNum} AND
    game_cards.game_id = ${gameId}`;

    let playerCards = await db.any(query)
    return playerCards;
  }

  static async getPlayerNumber(gameId, userId) {
    let query = `SELECT player_num FROM game_users
    WHERE game_id = ${gameId}
    AND user_id = ${userId}`

    let { player_num : playerNum } = await db.one(query);

    //console.log(playerNum)

    return playerNum
  }

  static async drawCard(gameId) {
    // will get a card from the deck with the lowest order
    let sql =`SELECT id FROM game_cards
    WHERE card_status = 0
    AND game_id = ${gameId}
    ORDER BY card_order
    LIMIT 1;`

    let {id : topDeckCard} = await db.one(sql)

    // Grabs the current player
    sql = `SELECT current_player FROM games
           WHERE id = ${gameId};`
    let {current_player : currPlayer} = await db.one(sql)

    // update card status
    sql = `UPDATE game_cards 
                      SET card_status = ${currPlayer}
                      WHERE 
                          game_id = ${gameId} AND
                          id = ${topDeckCard}`

    await db.none(sql)
    

  }
  static async drawCardNextPlayer(gameId) {
    // will get a card from the deck with the lowest order
    let sql =`SELECT id FROM game_cards
    WHERE card_status = 0
    AND game_id = ${gameId}
    ORDER BY card_order
    LIMIT 1;`

    let {id : topDeckCard} = await db.one(sql)

    // Grabs the next player
    
    sql = `SELECT clockwise FROM games
           WHERE id = ${gameId};`
    
    let {clockwise : rotation} = await db.one(sql)

    sql = `SELECT current_player FROM games
           WHERE id = ${gameId};`

    let {current_player : currPlayer} = await db.one(sql)


    // update card status
    sql = `UPDATE game_cards 
                      SET card_status = ${currPlayer + rotation}
                      WHERE 
                          game_id = ${gameId} AND
                          id = ${topDeckCard}`
    
    await db.none(sql)
  }

  // helper function to do card effect
  static async activateCardEffect(gameCardId, gameId) {
    // get card effect if any
    let sql = `SELECT type FROM game_cards
      JOIN cards ON game_cards.card_id = cards.id
      WHERE game_cards.id = ${gameCardId}`;
    const { type } = await db.one(sql);

    if ( type == 'normal' ) {
      // Nothing
    } else if (type == 'draw 2') {
      await Game_users.drawCardNextPlayer(gameId)
      await Game_users.drawCardNextPlayer(gameId)

    } else if (type == 'reverse') {
      let reverseSQL = `UPDATE games
            SET clockwise = clockwise * (-1)
            WHERE id = ${gameId}`
      console.log(reverseSQL);
      
      await db.none(reverseSQL)


    } else if (type == 'skip') {
      // skip next player
      await Games.nextPlayer(gameId)

    } else if (type == 'draw 4') {
      // draw four
      await Game_users.drawCardNextPlayer(gameId)
      await Game_users.drawCardNextPlayer(gameId)
      await Game_users.drawCardNextPlayer(gameId)
      await Game_users.drawCardNextPlayer(gameId)

      // TODO let color = pusher.getColorFromUser()
      let color = 'yellow'
      let updateSQL = `UPDATE GAMES
                       SET last_color = '${color}'
                       WHERE id = ${gameId}`
      
      await db.none(updateSQL)
      await Games.nextPlayer(gameId);

    } else if (type == 'changeColor') {
      // TODO let color = pusher.getColorFromUser()
      let color = 'yellow'
      let updateSQL = `UPDATE GAMES
                       SET last_color = '${color}'
                       WHERE id = ${gameId}`
      console.log(updateSQL);
      
      await db.none(updateSQL)
    }
  }
}

module.exports = Game_users;
