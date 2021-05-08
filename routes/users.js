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

  pusher.trigger("lobby", "create-game", {
    gameId: gameId,
    numPlayers: numPlayers,
  });

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
  let numPlayers = await Games.getNumPlayers(gameId)

 /* start game logic */
  if (numPlayers == 4) {
    // start game
    await Games.startGame(gameId);
    renderGame(req, res, gameId);

  } else {
    renderGameLobby(req, res, gameId);
  }
});

/* ======= resume game ========= */
router.get('/resume/:gameId', async (req, res) => {
  let gameId  = req.params.gameId;
  let userId = req.user.id;

  // CHECK IF GAME STARTED
  let started = await Games.isStarted(gameId);

  // IF GAME STARTED JOIN GAME ROOM
  if (started) {
    renderGame(req, res, gameId);
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

async function renderGame(req, res, gameId) {

  let userId = req.user.id;
  let playerNum = await GU.getPlayerNumber(gameId, userId);
  let currentPlayer = await Games.getCurrentPlayer(gameId);
  let rotation = await Games.getRotation(gameId);
  let numPlayersCards = await GU.getNumCardsInHand(gameId, userId);
  console.log('we goooood here')
  let neighbors = []
  console.log(numPlayersCards[0]);

  if (playerNum == 1) {
    neighbors.push(numPlayersCards[1])
    neighbors.push(numPlayersCards[2])
    neighbors.push(numPlayersCards[3])

  } else if (playerNum == 2) {
    neighbors.push(numPlayersCards[2])
    neighbors.push(numPlayersCards[3])
    neighbors.push(numPlayersCards[0])
  } else if (playerNum == 3) {
    neighbors.push(numPlayersCards[3])
    neighbors.push(numPlayersCards[0])
    neighbors.push(numPlayersCards[1])
  } else {
    neighbors.push(numPlayersCards[0])
    neighbors.push(numPlayersCards[1])
    neighbors.push(numPlayersCards[2])
  }
  
  let direction = rotation == 1 ? 'clockwise' : 'counterclockwise';

  res.render('authenticated/game', {
    title: 'Game Room',
    playerNum: playerNum,
    currentPlayer: currentPlayer,
    rotation: direction,
    neighbors: neighbors
  });
}
module.exports = router;
