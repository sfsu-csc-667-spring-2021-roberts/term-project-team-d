let db = require('./connection');

class ActiveRecord {
  table_name = '';
  fields = {};

  static selectAll() {
    return db.any(`SELECT * FROM ${table_name}`);
  }

  static find(id) {
    return db.oneOrNone(`SELECT * FROM ${table_name} WHERE id=$[id]`, { id: 0 });
  }

  static insert(data) {
    const columsAndValues = Object.keys(data).reduce((memo, key) =>{
      if(fields[key] !== undefined) {
        memo[0].push(key);
        memo[1].push(data[key]);
      }else{
        throw `The field ${gameId} does not exist on ${table_name}`;
      }
    }, [[], []]).map(entry => `(${entry.join(', ')})`)
    let insert = `INSERT INTO ${table_name} (${columsAndValues[0]}) VALUES (${columsAndValues[1]}) RETURNING *`
    return db
    .one(insert);
  }

  selectAttribute() {
  }
}

module.exports = ActiveRecord;
