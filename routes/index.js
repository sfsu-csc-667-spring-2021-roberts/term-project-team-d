/* File: routes/index.js
 * Purpose:
 * This will handle all the immediate authentication
 * and validation that must occur to authorize users
 */
var express = require('express');
let router  = express.Router();

/* GET home page. 
  check if authenticated or unathenticated */
router.get('/', (req, res, next) => {
  if (req.user) {
    res.redirect('/lobby');
  } else {
    next()
  }
});

module.exports = router;
