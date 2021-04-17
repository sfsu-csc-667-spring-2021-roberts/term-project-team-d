const socketio         = require('socket.io');
const io               = socketio();
const moment           = require('moment');
const passportSocketIo = require('passport.socketio')
const { sessionStore } = require('./app.js');

/* ============ MIDDLEWARE =====================*/
io.use(passportSocketIo.authorize({
  key:          'connect.sid',     
  secret:       process.env.SESSION_SECRET,    
  store:        sessionStore
}));

/* ============ CONNECTION =====================*/
io.on('connection', socket => {
  console.log(socket.request.user);

  message = formatMessage('System', 'Welcome to Uno Chat!')
  socket.emit('message', message);

  socket.broadcast.emit('message', 
    formatMessage('System', 'a user has joined the chat'));

    // listen for chat message
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage(socket.request.user.username, msg));
  });

  socket.on('createGame', () => {
    io.emit('createGame');
  });

  socket.on('disconnect', () => {
    io.emit('message', 'System: A user has left the chat');
  });

});


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
