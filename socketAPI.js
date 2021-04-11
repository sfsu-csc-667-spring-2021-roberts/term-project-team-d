const socketio = require('socket.io');
const io = socketio();

let socketAPI = { };
// socket logic here
socketAPI.io = io;

// runs when client connects
io.on('connection', socket => {
  // Welcome current user
  socket.emit('message', 'System: Welcome to Uno Chat!');
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

module.exports = socketAPI;
