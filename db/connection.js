const pgp = require('pg-promise')();
//const connection = pgp(process.env.DATABASE_URL);
const connection = pgp('tesst');

module.exports = connection;
