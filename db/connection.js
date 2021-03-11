const pgp = require('pg-promise')();

const config = {
  connectionString: process.env.DATABASE_URL,
  max: 30, // use up to 30 connections
  ssl:ssl
};
//const connection = pgp(process.env.DATABASE_URL);
const connection = pgp(config);

module.exports = connection;
