const socketio         = require('socket.io');
const io               = socketio();
const moment           = require('moment');
const passportSocketIo = require('passport.socketio')
const { sessionStore } = require('./app.js');
const Game             = require('./db/Games');

let socketArr = [];
let rooms = []; // [{ name, userId[] }]

/* ============ MIDDLEWARE =====================*/
io.use(passportSocketIo.authorize({
  key:          'connect.sid',     
  secret:       process.env.SESSION_SECRET,    
  store:        sessionStore
}));

/* ============ ON CONNECTION =====================*/
io.on('connection', socket => {
  /* variables */
  let userId = socket.request.user.id;
  console.log(rooms);
  socketArr.push(socket);
  console.log('Number of sockets:', socketArr.length);
  console.log('rooms:', io.sockets.adapter.rooms);

  // TODO Here we need to re-add peoeple to their rooms
  // how do we know which room someone is in?
  for (room of rooms) {
    for (id of room.userIds) {
      if (userId == id) {
        console.log('we joined the room');
        socket.join(room.name);
      }
    }
  }

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
    rooms.push({ 
      name: 'game' + gameId, 
      userIds: [userId] 
    });
    console.log(rooms);
    console.log('rooms:', io.sockets.adapter.rooms);
    io.emit('createGame', gameId);
  });

  /* ===============================*/
  /* ========== gameLobby.js =======*/
  /* ===============================*/

  // TODO currently creating separate sockets so the rooms
  // are also separate, need to converge them
  socket.on('joinGame', (gameId) => {
    let roomName = 'game' + gameId;

    // update rooms with new user
    for (room of rooms) {
      console.log('inside rooms loop in joinGame:');
      console.log(room);
      if (room.name == roomName) {
        console.log('we found the room to join');
        room.userIds.push(userId);
      }
    }
    socket.join(roomName);
    io.to(roomName).emit('gameUserJoin', userId);
    console.log('rooms:', io.sockets.adapter.rooms);
  });

  /* =========  On Disconnect ========= */
  socket.on('disconnect', () => {
    io.emit('message', 'System: A user has left the chat');
    console.log('WE LOST A SOCKET USERID: ', userId);
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
