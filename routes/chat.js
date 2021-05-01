const express = require('express');
const { route } = require('./authentication');
const router = express.Router();


// =========== pusher chat ===========
// TODO: I am not sure what room id is, I suppose gameID?
// please augment room ID thank you!
router.post('/:roomId', (req, res)=>{
    const message = req.body.message;
    const roomId = req.params.id;

    // console.log(message);
    req.app.get('pusher').trigger(`chat-${roomId === '0' ? 'lobby': roomId }`, 'message', {timestamp: Date.now(), message: message });
    res.status(200);

})

module.exports = router;