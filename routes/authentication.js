var express = require('express');
var router = express.Router();
const passport = require('passport');
let Users = require('../db/Users');
const bcrypt = require('bcrypt');

/* Register */
router.post('/register', async (req, res, next) => {
  console.log(req.body);
  let credentials = req.body;
  const hashedPassword = await bcrypt.hash(credentials.password, 10)
  credentials.password = hashedPassword;

  let err = await Users.register(credentials);
  if (err) {
    res.render('error', { 
      message: 'oh no an error!!',
      error: err.detail
    });
  }
  else {
    res.render('unauthenticated/registrationComplete');
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/lobby',
  failureRedirect: '/login.html',
  failureFlash: true
}));

/* OLD Login 
router.post('/login', async (req, res) => {
  let {email, password} = req.body
  let valid = await Users.validateLogin(email, password);
  if (valid.count == 0) {
    res.render('error', { 
      message: 'oh no an error!!',
      error: 'incorrect login credentials'
    });
  }
  else {
    res.cookie('session_id', 'testsession123');
    res.cookie('email', email);
    res.redirect('/');
  }
});
*/

module.exports = router;
