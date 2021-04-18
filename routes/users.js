var express = require('express');
var router = express.Router();
let Users = require('../db/Users');
let Games = require('../db/Games');
let GU = require('../db/Game_users');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* create game */
router.post('/createGame', async (req, res) => {
  let gameId = await Users.createGame(req.user.id);
  res.send({gameId: gameId.id});
});

router.get('/joinGame/:gameId', async (req, res) => {
  let gameId  = req.params.gameId;
  let userId = req.user.id;

  // Insert into DB
  GU.joinGame(gameId, userId);

  // Render page
  let { count: numPlayers } = await Games.getNumPlayers(gameId);
  res.render('authenticated/gameLobby', {
    title: 'Game Room',
    gameId: gameId,
    numPlayers: numPlayers
  });
});

router.get('/leaveGame/:gameId', async (req, res) => {
  // TODO update game_users to leave the game
  let games = await Games.getGameList();
  for (let game of games) {
    game.joinedAndNotStarted = await GU.joinedAndNotStarted(req.user.id, game.game_id);
  }
  res.render('authenticated/lobby', { 
    title: 'Uno Project!!',
    games: games
  });
});

router.get('/startGame', (req, res) => {
  res.send("<h1> you started a game!</h1>");
});

router.get('/:name', (req, res, next) => {
  res.json({
    name: req.params.name,
  });
});

module.exports = router;
