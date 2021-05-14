let express = require('express');
let path = require('path');
let router = express.Router();
let Games = require('../db/Games');
let GU = require('../db/Game_users');
const db = require('../db/connection');
const Pusher = require('pusher');
const moment = require('moment');
const pusher = new Pusher({
  appId: "1198857",
  key: "fe16d9c5190cef68646f",
  secret: "9f10efb58aa9704c64e0",
  cluster: "us3"
});

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

/* CHAT MESSAGE ROUTE */
router.post('/chatMessage', (req, res) => {
  let username = req.user.username;
  let { msg } = req.body;

  console.log('ERROR REPORT', username, msg);
  pusher.trigger("lobby", "chat-msg", {
    message:  msg,
    username: username,
    timestamp: moment().format('h:mm a')
  });

  res.status(200).json({ msg: 'test  pusher' });
});

module.exports = {router, renderLobby};
