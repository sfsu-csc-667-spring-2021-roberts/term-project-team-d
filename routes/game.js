var express = require('express');
var router = express.Router();
var path = require('path');

/* GET game page. */
router.get('/', function(req, res, next) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, '../game/index.html'));
});

module.exports = router;
