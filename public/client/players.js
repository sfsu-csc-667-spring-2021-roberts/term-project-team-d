/*
 * playerData
 *
 * contains virtual game info for each player
 * keys are the player IDs, and the values are dictionaries 
 * containing that player's data.
 *
 * Utilized mainly in the updateUI function, which mods elements
 * based on playerData contents.
 *
 * player data includes:
 * count - the players card count
 * current - whether it's that player's turn
 * name - the username of the player
 */
let playerData = {};

let curPlayer = -1;
let rotation = 1;

let playerListDiv = document.getElementById("players-list");
let playerRevDiv = document.getElementById("players-reverse");
let playerCurDiv = document.getElementById("players-current");

export async function getPlayerNum(gameId) {
  //fetch the player num.
  let url = '/game/'+gameId+'/getPlayerNum';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  let res = await response.json();
  return res.playerNum;
}

export function updateUI(){
  // Update rotation text (direction)
  let rotationString = (rotation == 1 ? 'normal' : 'reverse');
  playerRevDiv.innerText = "Rotation: " + rotationString;

  playerCurDiv.innerText = "It's player " + curPlayer + "'s turn.";
}

export function updateRotation(dir){
  rotation = dir;

  updateUI();
}

// Set target player to 'current'. Reset all others.
export function updateCurrentPlayer(player){
  curPlayer = player;
  updateUI();
}

// Update card count number related to a player
export function updatePlayerCount(id, count){
  playerData[id].count = count;

  updateUI();
}

export function updateNeighbors(neighbors){
  //console.log(neighbors);

  if(neighbors == undefined) return;

  for(let n of neighbors){
    let divElem = playerListDiv.children[n.card_status-1];

    divElem.children[2].innerText = n.count;
  }

  updateUI();
}
