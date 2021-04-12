const socketio         = require('socket.io');
const io               = socketio();
const passportSocketIo = require('passport.socketio');
const sessionStore     = require('./app');
const moment           = require('moment');


/* middleware */
io.use((socket, next) => {
  console.log('im a io middleware!');
  next()
});

// runs when client connects
io.on('connection', socket => {
  // create the auth token
  // Welcome current user
  message = formatMessage('System', 'Welcome to Uno Chat!')
  message = JSON.stringify(message);
  socket.emit('message', message);
  // Broadcasts when client connects
  socket.broadcast.emit('message', 'System: a user has joined the chat');
  // runs when a client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'System: A user has left the chat');
  });

  // listen for chat message
  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });
});


function formatMessage(user, text) {
  return { user, text, timestamp: moment().format('h:mm a') };
}


let socketAPI = { };
socketAPI.io = io;
module.exports = socketAPI;
