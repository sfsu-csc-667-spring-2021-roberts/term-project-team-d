var express = require('express');
var router = express.Router();
let Users = require('../db/Users');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* create game */
router.post('/createGame', async (req, res) => {
  console.log(req.user.id);
  Users.createGame(req.user.id);
  res.send();
});

router.get('/joinGame', (req, res) => {
  res.send("<h1> you joined a game!</h1>");
});

router.get('/startGame', (req, res) => {
  res.send("<h1> you started a game!</h1>");
});

router.get('/:name', (req, res, next) => {
  res.json({
    name: req.params.name,
  });
});

module.exports = router;
