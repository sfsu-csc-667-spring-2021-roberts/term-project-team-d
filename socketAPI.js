const socketio = require('socket.io');
const io = socketio();

let socketAPI = { };
// socket logic here
socketAPI.io = io;

io.on('connection', socket => {
  console.log("New Web Socket Connection");
});

module.exports = socketAPI;
