const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  db.any(`INSERT INTO test_table ("testString") VALUES ('Hello at`
         + `${Date.now()}')`)
  .then(_ => db.any(`SELECT * FROM test_table`))
  .then(results => res.json(results))
  .catch(error => {
    console.log(error)
    res.json({error})
  })
});
module.exports = router;
