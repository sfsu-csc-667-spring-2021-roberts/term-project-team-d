var express = require('express');
let router  = express.Router();
let GU      = require('../db/Game_users');
let Games   = require('../db/Games');
const Pusher = require('pusher');
const moment = require('moment');
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
    let playedCard = await GU.drawCard(gameId);

    //broadcasting number of cards of each player 
    let neighbors = await GU.getNumCardsInHand(gameId, userId);
    //console.log('just before the draw card trigger')
    pusher.trigger("game" + gameId, "draw-card", {
      numPlayersCards: neighbors
    });
    //console.log('just after the draw card trigger')
    //console.log('PlayedCard Object in drawCard route', playedCard);



    res.status(200).json({ 
      msg: 'game_user drew a card',
      playedCard: playedCard
    });
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
  console.log('PlayerCards in Route', playerCards);
  res.status(200).json(playerCards);
});

router.post('/:gameId/getLastCard', async (req, res) => {
  let gameId = req.params.gameId;
  let lastCard = await Games.getLastCard(gameId);
  let { last_color: chosenColor } = await Games.getLastColor(gameId);
  //console.log('in game.js route, lastcard', lastCard);
  res.status(200).json({ lastCard, chosenColor });
});

router.post('/:gameId/playCard', async (req, res) => {
  let { cardId, chosenColor } = req.body;
  let userId = req.user.id;
  let gameId = req.params.gameId;
  console.log('chosenColor', chosenColor);

  //console.log('inside route, card data:', cardId);

  let playerNum = await GU.getPlayerNumber(gameId, userId);
  let currentPlayer = await Games.getCurrentPlayer(gameId);
  //console.log('playerNum', playerNum);
  //console.log('currentPlayer', currentPlayer);

  /* Correct Players Turn */
  if (currentPlayer == playerNum) {
    //console.log('cardId in Route', cardId);
    let playedCard = await GU.playCard(cardId, gameId, chosenColor);
    //console.log('playedCard', playedCard);

    /* Invalid Card */
    if (playedCard == 'invalid card') {
      res.status(403).json({ msg: 'invalid card' });

    /* ===================================== */
    /* ============ IMPORTANT ============== */
    /* ===================================== */
    /* Played Successfully */
    } else {
      let count = await GU.countCurrentPlayerCards(gameId, playerNum);
      console.log('count inside game route', count);
      if (count == 0) {
        console.log('INSIDE END GAME IF ROUTE', gameId);
        await Games.endGame(gameId, playerNum);
        console.log('AFTER ENDGAME ORM in ROUTE');
        let username = req.user.username;
        pusher.trigger("game" + gameId, "end-game", {
          winner: username
        });
        return res.status(200).json({ msg: 'game ended' });
      }

      currentPlayer = await Games.getCurrentPlayer(gameId);
      let rotation = await Games.getRotation(gameId);
      let neighbors = await GU.getNumCardsInHand(gameId, userId);
      

      console.log('inside the else statement')
      pusher.trigger("game" + gameId, "play-card", {
        currentPlayer: currentPlayer,
        playedCard: playedCard,
        rotation: rotation,
        numPlayersCards: neighbors,
        chosenColor: chosenColor
      });

       
      res.status(200).json({ 
        msg: 'successfully played card',
        playedCard: playedCard
      });
    }
    /* HUGE OUTER ELSE - valid card but not your turn */
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

router.post('/:gameId/endGame', async (req, res) => {
  console.log('INSIDE ENDGAME ROUT');
  let { winner } = req.body;
  //res.render('authenticated/endGame.pug', { winner: winner });
  res.render('authenticated/endGame.pug');
});

router.post('/:gameId/chatMessage', async (req, res) => {
  let gameId = req.params.gameId;
  let username = req.user.username;
  let { msg } = req.body;
  
  pusher.trigger('game' + gameId, 'chat-msg', {
    message:  msg,
    username: username,
    timestamp: moment().format('h:mm a')
  });

  res.status(200).json({ msg: 'sent game lobby message' });

});

module.exports = router;
