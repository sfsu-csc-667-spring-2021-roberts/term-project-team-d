var express = require('express');
var path = require('path');
let router = express.Router();
let Games = require('../db/Games');
const db = require('../db/connection');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let games = await Games.getGameList();
  console.log(games);
  res.render('index', { 
    title: 'Uno Project!!',
    games: games
  });
});

router.post('/createGame', async (req, res, next) => {
  Users.createGame();
  res.send();
});

module.exports = router;
