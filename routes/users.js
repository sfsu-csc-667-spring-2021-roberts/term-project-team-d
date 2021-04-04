var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/:name', (req, res, next) => {
  res.json({
    name: req.params.name,
  });
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


/* POST Login */
router.post('/login', validateCookie, (req, res) => {
  res.cookie('session_id', 'testsession123');
  res.status(200).json({msg: 'testmessage'});
});

module.exports = router;
