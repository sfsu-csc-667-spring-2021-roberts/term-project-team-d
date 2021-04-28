var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var dummy_data = { 
    id: 0
  };

  res.render('game', dummy_data);
});

module.exports = router;
