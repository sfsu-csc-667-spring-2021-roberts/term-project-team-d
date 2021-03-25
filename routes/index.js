var express = require('express');
var path = require('path');
let router = express.Router();
let Game = require('../db/game');
const db = require('../db/connection');

/* GET home pae. */
router.get('/', async function(req, res, next) {
  let games = await Game.getGameList();
  res.render('index', { 
    title: 'Uno Project!!',
    games: games
  });
});

router.post('/register', async (req, res, next) => {
  console.log("registering user");
  console.log(req.body);
  res.send();
});

router.post('/createGame', async (req, res, next) => {
  Game.createGame();
  res.send();
});

module.exports = router;
