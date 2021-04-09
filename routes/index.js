/* File: routes/index.js
 * Purpose:
 * This will handle all the immediate authentication
 * and validation that must occur to authorize users
 */
var express = require('express');
let router  = express.Router();
var path    = require('path');
let Games   = require('../db/Games');
const db    = require('../db/connection');

/* GET home page. 
  check if authenticated or unathenticated */
router.get('/', (req, res) => {
  const { authorization } = req.headers;
  if (authorization && authorization === '123') {
    res.render('unauthenticated/index');
  } else {
    res.render('unauthenticated/index');
  }
});



module.exports = router;
