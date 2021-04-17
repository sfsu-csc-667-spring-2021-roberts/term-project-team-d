var express = require('express');
var router = express.Router();
let Users = require('../db/Users');
let Games = require('../db/Games');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* create game */
router.post('/createGame', async (req, res) => {
  let gameId = await Users.createGame(req.user.id);
  res.send({gameId: gameId.id});
});

router.get('/joinGame/:gameId', (req, res) => {
  // TODO call ORM join game
  let gameId = req.params.gameId;
  let numPlayers = Game.getNumPlayers(gameId);
  console.log(numPlayers);
  console.log(gameId);
  res.render('authenticated/gameLobby', {
    title: 'Game Room',
    gameId: gameId
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
