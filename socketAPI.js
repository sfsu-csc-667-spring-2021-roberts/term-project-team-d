const socketio = require('socket.io');
const io = socketio();
const formatMessage = require('./utils/messages');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser')
const moment = require('moment');

let socketAPI = { };
// socket logic here
socketAPI.io = io;

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'express.sid',
  secret: process.env.SESSION_SECRET,
  store: sessionstore
}));


// runs when client connects
io.on('connection', socket => {
  // Welcome current user
  socket.emit('message', formatMessage('System', 'Welcome to Uno Chat!'));
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


module.exports = socketAPI;
