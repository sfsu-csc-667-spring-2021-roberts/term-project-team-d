var express = require('express');
var path = require('path');
let router = express.Router();
let Users = require('../db/Users');
let Games = require('../db/Games');
const db = require('../db/connection');

/* GET home pae. */
router.get('/', async function(req, res, next) {
  let games = await Games.getGameList();
  console.log(games);
  res.render('index', { 
    title: 'Uno Project!!',
    games: games
  });
});

router.post('/register', async (req, res, next) => {
  Users.register(req.body);
  console.log("registering user");
  console.log(req.body);
  res.send();
});

router.post('/createGame', async (req, res, next) => {
  Users.createGame();
  res.send();
});

module.exports = router;
