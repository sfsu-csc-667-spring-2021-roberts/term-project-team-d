var express = require('express');
var router = express.Router();
const db = require('../db/connection');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let query = `SELECT player.game_id, COUNT(player.id) FROM player
    JOIN game ON game.id = player.game_id 
    GROUP BY player.game_id
    ORDER BY player.game_id ASC`;
  console.log(query);

  let games = await db.any(query);
  console.log(games);
  res.render('index', { 
    title: 'Uno Project!!',
    games: games
  });
});

router.post('/createGame', async (req, res, next) => {
  await db.none(`INSERT INTO game DEFAULT VALUES`);
  let temp = await db.one(`SELECT id FROM game ORDER BY id DESC LIMIT 1`);
  console.log(temp);
  db.none(`INSERT INTO player(game_id) VALUES(${temp.id})`);
  res.send("Created a game!");
});

module.exports = router;
