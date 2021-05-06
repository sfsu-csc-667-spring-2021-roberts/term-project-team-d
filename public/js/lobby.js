/* ====================================*/
/* ============  socketio =============*/
/* ====================================*/

/* ======= Chat Room ======== */
//socket.on('message', message => {
//  const chatBox = $('#chat-box');
//  const div = document.createElement('div');
//
//  div.classList.add('message');
//  div.innerHTML = `<p class="chat-messages"><span> [${message.timestamp}]</span>
//    <strong>${message.user}:</strong> ${message.text}</p>`;
//  chatBox.append(div);
//
//  // scrolldown automatically
//  chatBox.scrollTop(chatBox[0].scrollHeight);
//});

/* ======== Create Game Button =========*/
/*
socket.on('createGame', (gameId, numPlayers) => {
  const gameList = $('#gameList');
  const div = document.createElement('div');

  div.classList.add('gameli');
  div.innerHTML = '<li>Game id: ' + gameId;

  // Create Form
  let url = '/users/joinGame/' + gameId;
  let form = document.createElement('form');
  form.setAttribute("method", "POST");
  form.setAttribute("action", url);

  // submit button
  let submit = document.createElement('input');
  submit.setAttribute('data-gameId', gameId);
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'join just Created');
  submit.setAttribute('class', 'joinGameButton');

  form.append(submit);
  div.append(form);
  gameList.append(div);
});

/* ====================================*/
/* ========= Event Listeners ========== */
/* ====================================*/

/* ========= Chat Room ==============*/
const chatForm = $('#chat-form');
chatForm.submit( e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
 // socket.emit('chatMessage', msg);

  // Clear text input field for user
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

/* ============ Buttons ================ */

$('#createGame').on("click", async () => {
  // returns gameId
  let response = await fetch('/users/createGame', {
    method: 'POST',
  });
  let { gameId } = await response.json();

  // send gameId to socket
  //socket.emit('createGame', gameId);

});

$('#logout').on('click', async () => {
  await fetch('/auth/logout', {
    method: 'POST'
  });
  location.reload();
});
