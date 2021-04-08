var express = require('express');
var path = require('path');
let router = express.Router();
let Games = require('../db/Games');
const db = require('../db/connection');

/* GET home page. 
  check if authenticated or unathenticated
  */
router.get('/', (req, res, next) => {
  let authenticated = true;
  // if authenticated send to lobby
  if (authenticated) {
    res.redirect('/lobby');
  } else {
  // else send to register/login
  res.send('work in progress..');
  }
});


module.exports = router;
