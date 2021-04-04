var express = require('express');
var router = express.Router();

let Users = require('../db/Users');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/:name', (req, res, next) => {
  res.json({
    name: req.params.name,
  });
});

/* Register */
router.post('/register', async (req, res, next) => {
  console.log("registering user");
  console.log(req.body);
  let err = await Users.register(req.body);
  if (err) {
    res.render('error', { 
      message: 'oh no an error!!',
      error: err.detail
    });
  }
  else {
    res.render('registrationComplete');
  }
});

/* Authentication */
function validateCookie(req, res, next) {
  const { cookies } = req;
  console.log(cookies);
  if (cookies.session_id == 'testsession123') {
    next();
  } else {
    console.log('Invalid cookie credentials');
    res.status(401).send();
  }
}

function validateCredentials(req, res, next) {
}

/* Login */
router.post('/login', (req, res) => {
  let {email, password} = req.body
  validateLogin(email, password);
  res.cookie('session_id', 'testsession123');
  res.redirect('/');
});

module.exports = router;
