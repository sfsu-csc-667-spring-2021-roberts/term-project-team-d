var express = require('express');
var router = express.Router();
const db = require('../db/connection');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let query = `SELECT * FROM game`;
  let games = await db.any(query);
  console.log(games);
  res.render('index', { 
    title: 'Uno Project!!',
    games: games
  });
});

router.post('/createGame', async (req, res, next) => {
  db.none(`INSERT INTO game DEFAULT VALUES`);
  res.send("Created a game!");
});

module.exports = router;
