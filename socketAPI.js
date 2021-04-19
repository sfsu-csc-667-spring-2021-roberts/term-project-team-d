const socketio         = require('socket.io');
const io               = socketio();
const moment           = require('moment');
const passportSocketIo = require('passport.socketio')
const { sessionStore } = require('./app.js');
const Game             = require('./db/Games');

/* ============ MIDDLEWARE =====================*/
io.use(passportSocketIo.authorize({
  key:          'connect.sid',     
  secret:       process.env.SESSION_SECRET,    
  store:        sessionStore
}));

/* ============ ON CONNECTION =====================*/
io.on('connection', socket => {
  //console.log(socket.request.user);

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
    io.emit('createGame', gameId);
  });

  /* ===============================*/
  /* ========== gameLobby.js =======*/
  /* ===============================*/
  socket.on('joinGame', (gameId) => {
    let user = socket.request.user;
    let room = 'game' + gameId;
    console.log(user.username, 'joined room:', room);

    //io.to(room).emit('gameUserJoin', user.id);
    io.to(room).emit('gameUserJoin', user.id);
    //io.emit('gameUserJoin', user.id);
    socket.join(room);
    const rooms = io.of("/").adapter.rooms;
    const sids = io.of("/").adapter.sids;
    console.log('here are the rooms', rooms);
    console.log('here are the sids', sids);
  });

  /* =========  On Disconnect ========= */
  socket.on('disconnect', () => {
    io.emit('message', 'System: A user has left the chat');
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
