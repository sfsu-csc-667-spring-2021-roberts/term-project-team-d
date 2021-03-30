let db = require('./connection');
let ActiveRecord = require('./ActiveRecord');
let game = require('./Games')

class Users extends ActiveRecord {
    // register
    static register(user) {
      let query = `INSERT INTO users(username, password, email)
              VALUES('${user.firstName}', '${user.password}', '${user.email}')`;
      console.log(query);
      db.none(query);
    
    }
    //Login
    login() {
    }

    //Create a game
    static async createGame() {
        let gameId = await db.one(`INSERT INTO games(current_player, clockwise, started) VALUES(1, 1, 0) RETURNING id`);
      console.log(gameId);
        let query = `INSERT INTO game_users(game_id, user_id, player_num)
          VALUES(${gameId.id}, 1, 1)`

        db.none(query);
        //RETURNING id
        // do many things
        return gameId;
    }

    //Start a game
    startGame(){
        game.initializeCards();
        // deal out cards
        game.dealCards();
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
