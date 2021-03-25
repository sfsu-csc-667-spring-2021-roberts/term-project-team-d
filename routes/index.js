let express = require('express');
let router = express.Router();
let Game = require('../db/game');
const db = require('../db/connection');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let games = await Game.getGameList();
  res.render('index', { 
    title: 'Uno Project!!',
    games: games
  });
});

router.post('/createGame', async (req, res, next) => {
  Game.createGame();
  res.send();
});

module.exports = router;
