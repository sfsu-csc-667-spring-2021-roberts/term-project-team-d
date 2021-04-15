const socketio         = require('socket.io');
const io               = socketio();
const moment           = require('moment');
const passportSocketIo = require('passport.socketio')
const { sessionStore } = require('./app.js');
console.log(sessionStore);

/* middleware */
// Get session cookie then deserialize
io.use((socket, next) => {
  let data = socket.handshake;
  let cookieString = socket.handshake.headers.cookie;
  let cookie = cookieString.split('=');
  // got the connect.sid
  //console.log(cookie);
  // get length of sessions
  //console.log(cookie[1]);
  //try {
  //  sessionStore.length(( err, length ) => {
  //    if (err) return next(err);
  //    console.log(length);
  //  });
  //} catch (e) {
  //  console.log(e);
  //}
  //try {
  //  sessionStore.get(cookie[1], (err, session) => {
  //    console.log('test2');
  //    //if (err) return next(err);
  //    //if (!session) return next(new Error('Session Not Found'));
  //    //socket.handshake.session = session;
  //    //next();
  //  });
  //} catch (e) {
  //  console.log(e);
  //}
  next();
});

io.use(passportSocketIo.authorize({
  key:          'connect.sid',     
  secret:       process.env.SESSION_SECRET,    
  store:        sessionStore
}));

// runs when client connects, need to get user here
io.on('connection', socket => {
  console.log('SOCKET.IO ON CONNECTION');
  console.log(socket.request.user);


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
