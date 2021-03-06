'use strict';
const bcrypt   = require('bcrypt-nodejs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const hashedPassword = bcrypt.hashSync('password');

    await queryInterface.bulkInsert('users', [{
       username: 'JoeSchmoe',
       password: hashedPassword, // passsword
       email: 'test0@test.com'
     }, {
       username: 'DonJohn',
       password: hashedPassword, // passsword
       email: 'test1@test.com'
     }, {
       username: 'TankFrank',
       password: hashedPassword, // passsword
       email: 'test2@test.com'
     }, {
       username: 'BisqueChris',
       password: hashedPassword, // passsword
       email: 'test3@test.com'
     }]);

    await queryInterface.bulkInsert('games', [{
      current_player: 1,
      clockwise: 1,
      started: 0
    }]);

    await queryInterface.bulkInsert('game_users', [{
      game_id: 1,
      user_id: 1,
      player_num: 1
   }, {
      game_id: 1,
      user_id: 2,
      player_num: 2
   }, {
      game_id: 1,
      user_id: 3,
      player_num: 3
   }, {
      game_id: 1,
      user_id: 4,
      player_num: 4
  }]);
},

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
