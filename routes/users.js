var express = require('express');
var router = express.Router();

let Users = require('../db/Users');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});


/* create game */
router.post('/createGame', async (req, res, next) => {
  console.log(req.cookies.email);
  let accountId;
  accountId = await Users.getAccountId(req.cookies.email);
  Users.createGame(accountId);
  res.send();
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

router.get('/joinGame', (req, res) => {
  res.send("<h1> you joined a game!</h1>");
});

router.get('/startGame', (req, res) => {
  res.send("<h1> you joined a game!</h1>");
});

router.get('/:name', (req, res, next) => {
  res.json({
    name: req.params.name,
  });
});

module.exports = router;
