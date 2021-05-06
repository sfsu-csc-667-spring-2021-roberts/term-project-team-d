const express = require('express');
const router  = express.Router();
const db      = require('../db/connection');
const Game    = require('../db/Games');
const GU      = require('../db/Game_users');


router.post('/:gameId/startGame', async (req, res) => {
  let gameId = req.params.gameId;
  await Game.startGame(gameId);
  res.status(200).json({ msg: 'Starting game' });
});

router.post('/:gameId/reshuffle', async (req, res) => {
  let gameId = req.params.gameId;
  await Game.reshuffle(gameId);
  res.status(200).json({ msg: 'Starting game' });
});

router.post('/:gameId/playCard', async (req, res) => {
  let gameId = req.params.gameId;
  let { gameCardId } = req.body;
  console.log('BEFORE PLAYCARD');
  await GU.playCard(gameCardId, gameId);
  console.log('AFTER PLAYCARD');
  res.status(200).json({ msg: 'Playing a card' });
});

router.post('/:gameId/drawCard', async (req, res) => {
  let gameId = req.params.gameId;
  await GU.drawCard(gameId);
  console.log('drawing a card');
  res.status(200).json({ msg: 'game_user drew a card' });
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
/**
 * test isValid
 * test 
 * 
 * 
 */
module.exports = router;
