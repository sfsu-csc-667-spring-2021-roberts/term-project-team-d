const pgp = require('pg-promise')();
const connection = pgp(process.env.DATABASE_URL);
pgp.pg.defaults.ssl = true;

module.exports = connection;
