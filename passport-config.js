const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
let Users = require('./db/Users');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await Users.getUser(email);
    console.log('user inside passport config: ', user);
    if (user == null) {
      return done(null, false, { message: 'No user with email'});
    }
    try {
      if (await bcrypt.compare(password, user[0].password)) {
        console.log('passwords match!');
        return done(null, user[0]);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      } 
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => { 
    newId = await Users.getUserById(id);
    console.log('newId = ', newId);
    return done(null, newId[0]);
  });
}

module.exports = initialize
