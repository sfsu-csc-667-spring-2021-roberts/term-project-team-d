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
  let username = socket.request.user.username;
  socketArr.push(socket);

  /* logging if needed */
  //console.log(socket.request.user);
  //console.log(rooms);
  //console.log('Number of sockets:', socketArr.length);
  //console.log('rooms:', io.sockets.adapter.rooms);

  // TODO Here we need to re-add peoeple to their rooms
  //for (room of rooms) {
  //  for (id of room.userIds) {
  //    if (userId == id) {
  //      console.log('we joined the room');
  //      socket.join(room.name);
  //    }
  //  }
  //}

  /* ===============================*/
  /* ========== lobby.js ===========*/
  /* ===============================*/

  /* ======== Chat Room =========== */
  message = formatMessage('System', 'Welcome to Uno Chat!')
  socket.emit('message', message);

  socket.broadcast.emit('message', 
    formatMessage('System', username + ' joined the chat!'));

  // listen for chat message
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage(username, msg));
  });

  /* ========= Create Game ========= */
  socket.on('createGame', (gameId) => {
    rooms.push({ 
      name: 'game' + gameId, 
      userIds: [userId] 
    });
    //console.log(rooms);
    //console.log('rooms:', io.sockets.adapter.rooms);
    io.emit('createGame', gameId);
  });

  /* ===============================*/
  /* ========== gameLobby.js =======*/
  /* ===============================*/

  socket.on('joinGame', (gameId) => {
    let roomName = 'game' + gameId;

   // // update rooms with new user
   // for (room of rooms) {
   //   console.log('inside rooms loop in joinGame:');
   //   console.log(room);
   //   if (room.name == roomName) {
   //     console.log('we found the room to join');
   //     room.userIds.push(userId);
   //   }
   // }

    socket.join(roomName);
    socket.to(roomName).emit('gameUserJoin', username);
    console.log('rooms:', io.sockets.adapter.rooms);
  });

  /* ===============================*/
  /* =======  On Disconnect ======== */
  /* ===============================*/
  socket.on('disconnect', () => {
    let dcmsg = username + ' has left the chat!';
    io.emit('message', formatMessage('System', dcmsg));

    //console.log('WE LOST A SOCKET USERID: ', userId);
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
