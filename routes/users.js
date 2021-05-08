var express = require('express');
var router = express.Router();
let Users = require('../db/Users');
let Games = require('../db/Games');
let GU = require('../db/Game_users');
const {renderLobby} = require('../routes/lobby');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* ======= create game ========= */
router.post('/createGame', async (req, res) => {
  let gameId = await Users.createGame(req.user.id);
  let numPlayers = await Games.getNumPlayers(gameId);
  res.send({
    gameId: gameId,
    numPlayers: numPlayers
  });
});

/* ======= join game ========= */
router.post('/joinGame/:gameId', async (req, res) => {
  let gameId  = req.params.gameId;
  let userId = req.user.id;
  await GU.joinGame(gameId, userId);

  renderGameLobby(req, res, gameId);

 /* start game logic */
 // if (Games.getNumPlayers() == 4) {
 //   // start game
 //   Games.startGame(gameId);
 // } else {
 //   res.send();
 // }

  //res.send();
});

/* ======= resume game ========= */
router.get('/resume/:gameId', async (req, res) => {
  let gameId  = req.params.gameId;
  let userId = req.user.id;

  // CHECK IF GAME STARTED
  let started = await Games.isStarted(gameId);

  // IF GAME STARTED JOIN GAME ROOM
  if (started) {
    console.log('join fake game room');
    res.send();
  } else {
    renderGameLobby(req, res, gameId);
  }
});

/* ======= leave game ========= */
router.post('/leaveGame/:gameId', async (req, res) => {
  let userId = req.user.id;
  let gameId = req.params.gameId;
  await GU.leaveGame(gameId, userId);
  
  renderLobby(req, res);
});

router.get('/startGame', (req, res) => {
  res.send("<h1> you started a game!</h1>");
});

router.get('/:name', (req, res, next) => {
  res.json({
    name: req.params.name,
  });
});

/* ======= Helper functions ======== */
async function renderGameLobby(req, res, gameId) {
  let numPlayers = await Games.getNumPlayers(gameId);
  console.log('render gameLobby');
  let usernames = await Games.getUsernames(gameId);
  console.log('render gameLobby');
  res.render('authenticated/gameLobby', {
    title: 'Game Room',
    gameId: gameId,
    numPlayers: numPlayers,
    usernames: usernames
  });
}
module.exports = router;
