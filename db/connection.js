const pgp = require('pg-promise')();

const config = {
  //connectionString: process.env.DATABASE_URL,
  connectionString: 'postgres://john:pass123@localhost:5432/products',
  max: 30, // use up to 30 connections
  ssl:ssl
};
//const connection = pgp(process.env.DATABASE_URL);
const connection = pgp(config);

module.exports = connection;
