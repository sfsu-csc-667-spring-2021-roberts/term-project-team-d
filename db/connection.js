const pgp = require('pg-promise')();
 // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const connection = pgp(process.env.DATABASE_URL);
//pgp.pg.defaults.ssl = true;

module.exports = connection;
