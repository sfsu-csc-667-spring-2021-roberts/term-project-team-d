var express = require('express');
let router  = express.Router();
let GU = require('../db/Game_users');
let Games = require('../db/Games');

router.post('/:gameId/getPlayerHand', async (req, res) => {
  let message = req.body;
  console.log(message);
  let userId = req.user.id;
  let gameId = req.params.gameId;
  let playerCards = await GU.getCardsInHand(gameId, userId);
  res.status(200).json(playerCards);
});

router.post('/:gameId/getLastCard', async (req, res) => {
  //let message = req.body;
  //console.log(message);
  //let userId = req.user.id;
  let gameId = req.params.gameId;
  let lastCard = await Games.getLastCard(gameId);
  res.status(200).json(lastCard);
});

router.post('/:gameId/playCard', async (req, res) => {
  let { cardId } = req.body;
  let userId = req.user.id;
  let gameId = req.params.gameId;

  console.log('inside route, card data:', cardId);

  let playerNum = await GU.getPlayerNumber(gameId, userId);
  let currentPlayer = await Games.getCurrentPlayer(gameId);
  console.log('playerNum', playerNum);
  console.log('currentPlayer', currentPlayer);

  if (currentPlayer == playerNum) {
    console.log('cardId in Route', cardId);
    let playedCard = await GU.playCard(cardId, gameId);
    console.log('playedCard', playedCard);
    if (playedCard == 'invalid card') {
      res.status(403).json({ msg: 'invalid card' });
    } else {
      res.status(200).json({ 
        msg: 'successfully played card',
        playedCard: playedCard
      });
    }
  } else {
    res.status(403).json({ msg: 'forbidden' });
  }
});

/* TODO route that gets last_card */

/* GET home page. */
router.get('/', function(req, res, next) {
  var dummy_data = { 
    id: 0
  };

  res.render('game', dummy_data);
});

module.exports = router;
