const socketio         = require('socket.io');
const io               = socketio();
const moment           = require('moment');
const passportSocketIo = require('passport.socketio')
const { sessionStore } = require('./app.js');
const Game             = require('./db/Games');

let socketArr = [];

/* ============ MIDDLEWARE =====================*/
io.use(passportSocketIo.authorize({
  key:          'connect.sid',     
  secret:       process.env.SESSION_SECRET,    
  store:        sessionStore
}));

/* ============ ON CONNECTION =====================*/
io.on('connection', socket => {
  console.log(socket);
  //console.log(socket.request.user);
  // add socket to socket array
  socketArr.push(socket);
  console.log('Number of sockets:', socketArr.length);
  console.log(socket.request.user);

  /* ===============================*/
  /* ========== lobby.js ===========*/
  /* ===============================*/

  /* ======== Chat Room =========== */
  message = formatMessage('System', 'Welcome to Uno Chat!')
  socket.emit('message', message);

  socket.broadcast.emit('message', 
    formatMessage('System', 'a user has joined the chat'));

  // listen for chat message
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage(socket.request.user.username, msg));
  });

  /* ========= Create Game ========= */
  socket.on('createGame', (gameId) => {
    socket.gameId = gameId;
    console.log(socket);
    io.emit('createGame', gameId);
  });

  /* ===============================*/
  /* ========== gameLobby.js =======*/
  /* ===============================*/

  // TODO currently creating separate sockets so the rooms
  // are also separate, need to converge them
  socket.on('joinGame', (gameId) => {
    let user = socket.request.user;
    let room = 'game' + gameId;
    console.log(user.username, 'joined room:', room);

    // need to find socket with our gameId
    //for (let gameSocket of socketArr) {
    //  if ( gameSocket.gameId == gameId) {
    //    console.log(gameSocket);
    //    gameSocket.join(room);
    //    gameSocket.to(room).emit('gameUserJoin', user.id);
    //    break;
    //  }
    //}

    //io.to(room).emit('gameUserJoin', user.id);
    //io.emit('gameUserJoin', user.id);
    //const rooms = io.of("/").adapter.rooms;
    //const sids = io.of("/").adapter.sids;
    // need to find socket with gameId and user
  });

  /* =========  On Disconnect ========= */
  socket.on('disconnect', () => {
    io.emit('message', 'System: A user has left the chat');
    console.log('WE LOST A SOCKET');
  });

});


/* =========== Helper Functions ================ */
function formatMessage(user, text) {
  return { 
    user, 
    text,
    timestamp: moment().format('h:mm a') 
  };
}


let socketAPI = { };
socketAPI.io = io;
module.exports = socketAPI;
