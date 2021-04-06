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
router.post('/login', async (req, res) => {
  let {email, password} = req.body
  let valid = await Users.validateLogin(email, password);
  console.log('-----VALID?---------->',valid.count);
  if (valid.count == 0) {
    res.render('error', { 
      message: 'oh no an error!!',
      error: 'incorrect logging credentials'
    });
  }
  else {
    res.cookie('session_id', 'testsession123');
    res.redirect('/');
  }
  //res.cookie('session_id', 'testsession123');
  
});

module.exports = router;
