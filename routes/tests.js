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


router.get('/:gameId/getLastCard', async (req, res) => {
  //let message = req.body;
  //console.log(message);
  //let userId = req.user.id;
  console.log('HEREEEEEEEEEEEE')
  let gameId = req.params.gameId;
  let lastCard = await Game.getLastCard(gameId);
  res.status(200).json(lastCard);
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

router.post('/:gameId/getPlayerNum', async (req, res) => {
  let gameId = req.params.gameId;
  let userId = req.user.id;
  let playerNum = await GU.getPlayerNumber(gameId, userId);

  res.status(200).json({ playerNum: playerNum });
});

/**
 * test isValid
 * test 
 * 
 * 
 */
module.exports = router;
