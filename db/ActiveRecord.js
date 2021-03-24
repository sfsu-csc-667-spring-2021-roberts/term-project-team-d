let db = require('./connection');

class ActiveRecord {
  table_name = '';
  fields = {};

  static selectAll() {
    return db.any(`SELECT * FROM ${table_name}`);
  }

  static find(id) {
    return db.oneOrNone(`SELECT * FROM ${table_name} WHERE id=$[id]`, {id:0});
  }

  selectAttribute() {
  }
}

module.exports = ActiveRecord;
