var express = require('express');
var path = require('path');
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

router.get('/gameLobby/:gameId', async (req, res) => {
  let numPlayers = await Games.getNumPlayers(gameId);
});

router.post('/:gameId/chatMessage', async (req, res) => {
  let gameId = req.params.gameId;
  let username = req.user.username;
  let { msg } = req.body;
  
  pusher.trigger('game-lobby' + gameId, 'chat-msg', {
    message:  msg,
    username: username,
    timestamp: moment().format('h:mm a')
  });

  res.status(200).json({ msg: 'sent game lobby message' });

});


module.exports = router;
