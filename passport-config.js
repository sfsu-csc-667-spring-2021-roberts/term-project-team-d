const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
let Users = require('./db/Users');

function initialize(passport, email) {
  const authenticateUser = async (email, password, done) => {
    const user = Users.getUser(email);
    console.log('user inside passport config: ', user);
    if (user == null) {
      return done(null, false, { message: 'No user with email'});
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      } 
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
  passport.serializeUser((user, done) => { });
  passport.deserializeUser((id, done) => { });
}

module.exports = initialize
