var express = require('express');
var path = require('path');
let router = express.Router();
let Games = require('../db/Games');
let GU = require('../db/Game_users');
const db = require('../db/connection');

/* GET home page. */
router.get('/', async (req, res, next) => {
  renderLobby(req, res);
});

async function renderLobby(req, res) {
  let games = await Games.getGameList();
  for (let game of games) {
    game.isJoined = await GU.isJoined(req.user.id, game.game_id);
  }
  res.render('authenticated/lobby', { 
    title: 'Uno Project!!',
    games: games
  });
}

module.exports = {router, renderLobby};
