const socketio         = require('socket.io');
const io               = socketio();
//const passportSocketIo = require('passport.socketio');
//const cookieParser     = require('cookie-parser')
//const sessionStore     = require('./app');
const moment           = require('moment');

let socketAPI = { };
socketAPI.io = io;

console.log("before authorization");
/* socketio config */
socketAPI.io.use(passportSocketIo.authorize({
     cookieParser:   cookieParser,
     key:            'connect.sid',
     secret:         process.env.SESSION_SECRET,
     store:          sessionStore,
     fail:           onAuthorizeFail,
     success:        onAuthorizeSuccess
}));
console.log("after authorization");

function onAuthorizeFail(data, message, error, accept){
  console.log('FAILED TO AUTHORIZE');
  console.log(message);
  // error indicates whether the fail is due to an error or just a unauthorized client
  if(error)  throw new Error(message);
  // send the (not-fatal) error-message to the client and deny the connection
  return accept(new Error(message));
}

function onAuthorizeSuccess(data, accept) {
  console.log("Successful IO connection");
  // accept connection
  accept();

  // reject connection (for whatever reason)
  //accept(new Error('optional reason'));
}


// runs when client connects
io.on('connection', socket => {
  console.log('On Connection');
  console.log(socket.request.user);
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
