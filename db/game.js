class Game extends ActiveRecord {
  id = -1;
  game = -1;
  username = '';

 
  createGame() {
    // get id

    initializeCards();

    // deal out cards
    dealCards();
  }

  endGame() {
  }

  initializeCards() {
  }

  dealCards() {
  }

  playerLeave() {
  }
}


