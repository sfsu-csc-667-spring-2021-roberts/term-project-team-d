
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

  /* ========= Helper Functions =========
function getarrangement(playerNum, numPlayersCards) {
  let neighbors = [];

  if (playerNum == '1') {
    neighbors.push(numPlayersCards[1])
    neighbors.push(numPlayersCards[2])
    neighbors.push(numPlayersCards[3])

  } else if (playerNum == '2') {
    neighbors.push(numPlayersCards[2])
    neighbors.push(numPlayersCards[3])
    neighbors.push(numPlayersCards[0])
  } else if (playerNum == '3') {
    neighbors.push(numPlayersCards[3])
    neighbors.push(numPlayersCards[0])
    neighbors.push(numPlayersCards[1])
  } else {
    neighbors.push(numPlayersCards[0])
    neighbors.push(numPlayersCards[1])
    neighbors.push(numPlayersCards[2])
  }
  return neighbors;

}
*/

export function updatePlayers(playerNum, playerCards){
  /*/console.log(neighbors)
  let topPlayer = document.getElementById('p2Cards');
  topPlayer.innerHTML =  'number of cards: '+ neighbors[1].count
  //update left div
  let leftPlayer = document.getElementById('p3Cards');
  leftPlayer.innerHTML =  'number of cards: '+ neighbors[0].count
  //update left div
  let rightPlayer = document.getElementById('p4Cards');
  rightPlayer.innerHTML =  'number of cards: '+ neighbors[2].count*/
}

export function updateRotation(dir){
  let rotation = dir == 1 ? 'clockwise' : 'counterclockwise'
}

export function updateCurrentPlayer(player){

}
