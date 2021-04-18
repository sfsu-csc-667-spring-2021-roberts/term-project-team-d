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
  res.send({gameId: gameId.id});
});

/* ======= join game ========= */
router.get('/joinGame/:gameId', async (req, res) => {
  let gameId  = req.params.gameId;
  let userId = req.user.id;

  // Insert into DB
  GU.joinGame(gameId, userId);

  // Render page
  renderGameLobby(req, res, gameId);
  });

/* ======= resume game ========= */
router.get('/resume/:gameId', async (req, res) => {
  let gameId  = req.params.gameId;
  let userId = req.user.id;

  // CHECK IF GAME STARTED
  let started = await Games.isStarted(gameId);
  console.log(started);
  // IF GAME STARTED JOIN GAME ROOM
  if (started) {
    console.log('join fake game room');
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
  let { count: numPlayers } = await Games.getNumPlayers(gameId);
  res.render('authenticated/gameLobby', {
    title: 'Game Room',
    gameId: gameId,
    numPlayers: numPlayers
  });
}


module.exports = router;
