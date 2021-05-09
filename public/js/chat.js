// ====== pusher chat =====
const Pusher = require('pusher');

const pusher = new Pusher({
  appId:process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true  
});

const channel = window.peter.pusher.subscribe('chat-lobby');

const messageBox = document.querySelector('#message-box');
const chatArea = document.querySelector('#messages');

channel.bind('message', ( message, timestamp) =>{
  // alert(JSON.stringify(data));
  const div = document.createDocumentFragment('div');
  div.innerHTML = `<b>${ timestamp.format('MMMM Do YYYY, h:mm:ss a') }<b> ${message} `;
  chatArea.appendChild();
});

const sendMessage = () =>{
  const message = messageBox.value;
  messageBox.value = "";

  // prof said change id to post game room id for game-chat
  fetch('/chat/0', {
    headers: {'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify( { message } ),
  }).then(_=> console.log('message sent'))
  .catch(consle.log);
}
  
messageBox.querySelector('#message-box').addEventListener('keyup', event =>{
  if (event.keyCode === 13){
    sendMessage();
  }
});

document.querySelector('#message-box').addEventListener('click', event =>{
  sendMessage();
});