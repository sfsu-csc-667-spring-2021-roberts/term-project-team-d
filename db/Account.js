let db = require('./connection');
let ActiveRecord = require('./ActiveRecord');
let game = require('./Game')

class Account extends ActiveRecord {
    // register
    register() {
       
    }
    //Login
    login() {
    }
    

    //Create a game
    const createGame = async (accountId) => {
        let gameId = await db.one(`INSERT INTO game DEFAULT VALUES RETURNING id`);
    
        db.none(`INSERT INTO player(game_id,player_num) VALUES(${gameId},1)`);
    
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