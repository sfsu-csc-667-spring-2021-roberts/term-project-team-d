const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
const moment = require('moment');
// const pusher = new Pusher({
//   appId: "1198857",
//   key: "fe16d9c5190cef68646f",
//   secret: "9f10efb58aa9704c64e0",
//   cluster: "us3"
// });

// /* CHAT MESSAGE ROUTE */
// router.post('/chatMessage', (req, res) => {
//   let username = req.user.username;
//   let { msg } = req.body;

//   console.log('ERROR REPORT', username, msg);
//   pusher.trigger("lobby", "chat-msg", {
//     message:  msg,
//     username: username,
//     timestamp: moment().format('h:mm a')
//   });

//   res.status(200).json({ msg: 'test  pusher' });
// });


// =========== pusher chat ===========

router.post('/:roomId', (req, res)=>{
    const message = req.body.message;
    const roomId = req.params.id;

    // console.log(message);
    req.app.get('pusher').trigger(`chat-${roomId === '0' ? 'lobby': roomId }`, 'message', {timestamp: Date.now(), message: message });
    res.status(200);

});

module.exports = router;
