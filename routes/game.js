var express = require('express');
let router  = express.Router();
let GU      = require('../db/Game_users');
let Games   = require('../db/Games');
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: "1198857",
  key: "fe16d9c5190cef68646f",
  secret: "9f10efb58aa9704c64e0",
  cluster: "us3"
});

router.post('/:gameId/drawCard', async (req, res) => {
  let gameId = req.params.gameId;
  let userId = req.user.id;

  let playerNum = await GU.getPlayerNumber(gameId, userId);
  let currentPlayer = await Games.getCurrentPlayer(gameId);
  //console.log('playerNum', playerNum);
  //console.log('currentPlayer', currentPlayer);

  /* Correct Players Turn */
  if (currentPlayer == playerNum) {
    await GU.drawCard(gameId);
    res.status(200).json({ msg: 'game_user drew a card' });
  } else {
    res.status(403).json({ msg: 'Cant draw, not your turn, forbidden' });
  }

  //console.log('drawing a card');
});

router.post('/:gameId/getPlayerHand', async (req, res) => {
  let message = req.body;
  //console.log(message);
  let userId = req.user.id;
  let gameId = req.params.gameId;
  let playerCards = await GU.getCardsInHand(gameId, userId);
  res.status(200).json(playerCards);
});

router.post('/:gameId/getLastCard', async (req, res) => {
  let gameId = req.params.gameId;
  let lastCard = await Games.getLastCard(gameId);
  //console.log('in game.js route, lastcard', lastCard);
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

  /* Correct Players Turn */
  if (currentPlayer == playerNum) {
    console.log('cardId in Route', cardId);
    let playedCard = await GU.playCard(cardId, gameId);
    console.log('playedCard', playedCard);

    /* Invalid Card */
    if (playedCard == 'invalid card') {
      res.status(403).json({ msg: 'invalid card' });

    /* ===================================== */
    /* ============ IMPORTANT ============== */
    /* ===================================== */
    /* Played Successfully */
    } else {
      
      currentPlayer = await Games.getCurrentPlayer(gameId);
      let rotation = await Games.getRotation(gameId);
      let neighbors = await GU.getNumCardsInHand(gameId, userId);
      

      console.log('inside the else statement')
      pusher.trigger("game" + gameId, "play-card", {
        currentPlayer: currentPlayer,
        playedCard: playedCard,
        rotation: rotation,
        numPlayersCards: neighbors
      });
      

      res.status(200).json({ 
        msg: 'successfully played card',
        playedCard: playedCard
      });
    }
  } else {
    res.status(403).json({ msg: 'forbidden' });
  }
});

router.post('/:gameId/getPlayerNum', async (req, res) => {
  let gameId = req.params.gameId;
  let userId = req.user.id;

  let playerNum = await GU.getPlayerNumber(gameId, userId);
  console.log('playerNum: ', playerNum)

  res.status(200).json({ 
    playerNum: playerNum 
  });

});



module.exports = router;
