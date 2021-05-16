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

let currentPlayer = -1;
let rotation = 1;

let playerListDiv = document.getElementById("players-list");
let playerRevDiv = document.getElementById("players-reverse");

export async function getPlayerNum(gameId) {
  //fetch the player num.
  let url = '/game/'+gameId+'/getPlayerNum';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}

export function updateUI(){
  // Update rotation text (direction)
  let rotationString = (rotation == 1 ? 'normal' : 'reverse');
  playerRevDiv.innerText = rotationString;

  // Update player text (names, counts, bolds)
  for (var player in playerData){
    let label = playerListDiv.children[player.order];

    label.style.fontWeight = player.current ? 'bold' : 'normal';
    label.innerText = player.name + " : " + player.count;
  }
}

export function updateRotation(dir){
  rotation = dir;

  updateUI();
}

// Set target player to 'current'. Reset all others.
export function updateCurrentPlayer(id){
  for (var player in playerData){
    player.current = false;
  }

  playerData[id].current = true;

  updateUI();
}

// Update card count number related to a player
export function updatePlayerCount(id, count){
  playerData[id].count = count;

  updateUI();
}

// Grab list of all player ids in game
// fill out playerData for each (current, count, name)
export function initPlayers(gameId){
  let ids = await getPlayerIds(gameId);
  currentPlayer = await getCurrentPlayer(gameId);

  for (id in ids){
    playerData[id] = {};

    let isCurrent = (id == currentPlayer);
    playerData[id].current = isCurrent;

    playerData[id].name = await getPlayerName(id);
    playerData[id].order = await getPlayerOrder(gameId, id);
    playerData[id].count = await getPlayerCount(gameId, id);
  }

  updateUI();
}

