var express = require('express');
var router = express.Router();
let Users = require('../db/Users');
let Games = require('../db/Games');
let GU = require('../db/Game_users');
const Pusher = require('pusher');
const {renderLobby} = require('../routes/lobby');
const pusher = new Pusher({
  appId: "1198857",
  key: "fe16d9c5190cef68646f",
  secret: "9f10efb58aa9704c64e0",
  cluster: "us3"
});

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
  let username = req.user.username;
  await GU.joinGame(gameId, userId);
  let numPlayers = await Games.getNumPlayers(gameId)

  /* Pusher broadcast */
  pusher.trigger('game-lobby' + gameId, 'on-join', {
    username: username,
    numPlayers: numPlayers
  });

    console.log('before four player check');
 /* start game logic */
  if (numPlayers == 4) {
    //await renderGameLobby(req, res, gameId);
    console.log('inside start game route');
    await Games.startGame(gameId);

    /*
    setTimeout(function () {
      pusher.trigger('game-lobby' + gameId, 'start-game', {
      });
    }, 1000);
    */
    await pusher.trigger('game-lobby' + gameId, 'start-game', {
    });

    let startGameUrl = '/users/startGame/' + gameId;
    res.redirect(startGameUrl);

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
  let username = req.user.username;
  await GU.leaveGame(gameId, userId);
  let numPlayers = await Games.getNumPlayers(gameId)

  /* broadcast */
  pusher.trigger("game-lobby" + gameId, "on-leave", {
    username: username,
    numPlayers: numPlayers
  });

  renderLobby(req, res);
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

router.get('/startGame/:gameId', async (req, res) => {
  let gameId = req.params.gameId;

  renderGame(req, res, gameId);
});

async function renderGame(req, res, gameId) {

  let userId = req.user.id;
  let playerNum = await GU.getPlayerNumber(gameId, userId);
  let currentPlayer = await Games.getCurrentPlayer(gameId);
  let rotation = await Games.getRotation(gameId);
  let numPlayersCards = await GU.getNumCardsInHand(gameId, userId);
  let neighbors = []
  //console.log(numPlayersCards[0]);

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
