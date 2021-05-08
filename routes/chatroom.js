const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
const moment = require('moment');

const pusher = new Pusher({
  appId: "1198857",
  key: "fe16d9c5190cef68646f",
  secret: "9f10efb58aa9704c64e0",
  cluster: "us3"
});

/* CHAT MESSAGE ROUTE */
router.post('/test', (req, res) => {
  let username = req.body.user.name;
  let { msg } = req.body;

  pusher.trigger("lobby-chatroom", "chat-msg", {
    message:  msg,
    timestamp: moment().format('h:mm a')
  });

  res.status(200).json({ msg: 'test  pusher' });
});

module.exports = router;
