var express = require('express');
var path = require('path');
let router = express.Router();
let Games = require('../db/Games');
let GU = require('../db/Game_users');
const db = require('../db/connection');

router.get('/gameLobby/:gameId', async (req, res) => {
  let numPlayers = await Games.getNumPlayers(gameId);

  console.log(numPlayers);
});


module.exports = router;
