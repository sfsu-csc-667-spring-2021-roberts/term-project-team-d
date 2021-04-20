const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const Game = require('../db/Games');


router.post('/:gameId/startGame', (req, res) => {
  let gameId = req.params.gameId;
  Game.startGame(gameId);
  res.status(200).json({ msg: 'successfully inserted cards' });
});

router.get('/', (req, res) => {
  db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at`
         + `${Date.now()}')`)
  .then(_ => db.any(`SELECT * FROM test_table`))
  .then(results => res.json(results))
  .catch(error => {
    console.log(error)
    res.json({error})
  })
});

module.exports = router;
