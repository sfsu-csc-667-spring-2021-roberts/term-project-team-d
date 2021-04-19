let db = require('./connection');
let ActiveRecord = require('./ActiveRecord');
let game = require('./Games')

class Users extends ActiveRecord {

  static joinedGames(userId) {
    let query = `SELECT game_id FROM game_users WHERE user_id = ${user_id} AND;`

    return db.all(query);
  }

  static getAccountId(email) {
    let query = `SELECT id FROM users WHERE email = '${email}'`;
    return db.one(query);
  }

  static getPassword(email) {
    let query = `SELECT password FROM users WHERE email = '${email}'`;
    return db.one(query);
  }

  static getUser(email) {
    let query = `SELECT * FROM users WHERE email = '${email}'`;
    return db.any(query);
  }

  static getUserById(id) {
    let query = `SELECT * FROM users WHERE id = ${id}`;
    return db.any(query);
  }

    // register
  static async register(user) {
    let query = `INSERT INTO users(username, password, email)
                VALUES('${user.firstName}', 
                '${user.password}', 
                '${user.email},
                ON CONFLICT DO NOTHING')`;
    console.log(query);

    let error = null;
      await db.none(query).catch( err => {
        error = err
      });
    return error;
  }
  //Login
  static validateLogin(email,password) {
    //first check if the email exists: counting 
    //counting the number of rows when 
    //we do a select email
    
    //then, do the same thing for the password.
    let query = `SELECT COUNT(*) FROM users
                 WHERE email = '${email}' AND
                 password = '${password}'`;
    return db.one(query)

  }

  //Create a game
  static async createGame(id) {
      let gameId = await db.one(`
        INSERT INTO games(current_player, clockwise, started) 
        VALUES(1, 1, 0) RETURNING id`
      );
      let query = `INSERT INTO game_users(game_id, user_id, player_num)
        VALUES(${gameId.id}, ${id}, 1)`;

      db.none(query);
      return gameId;
  }

  //get number of players already in a lobby
  static async getPlayerCounter(id) {
    let getPlayerCounter = `SELECT player_num FROM game_users WHERE id= ${id}`
    return await db.one(getPlayerCounter)
  }

    //Start a game
    startGame() {
        game.initializeCards();
        // deal out cards
        game.dealCards();
        //should send players to a new gaming page
    }

    //Join a game
    joinGame(){

    }

    //change password
    changePassword(){

    }

    //change username
    changeUsername(){
        
    }
}
module.exports = Users;
