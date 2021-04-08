var express = require('express');
var path = require('path');
let router = express.Router();
let Games = require('../db/Games');
const db = require('../db/connection');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let games = await Games.getGameList();
  res.render('authenticated/lobby', { 
    title: 'Uno Project!!',
    games: games
  });
});


module.exports = router;
