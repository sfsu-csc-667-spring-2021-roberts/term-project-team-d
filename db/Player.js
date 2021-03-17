let db = require('./connection');

class Player extends ActiveRecord {
  id = -1;
  game = -1;
  username = '';
}
