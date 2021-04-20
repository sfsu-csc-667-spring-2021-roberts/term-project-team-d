'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.bulkInsert('users', [{
      id: 0,
      username: 'deckDealer',
      password: 'notApplicable',
      email: 'deck@admin.com'
     }, {
       id: -1,
       username: 'discardDealer',
      password: 'notApplicable',
      email: 'discard@admin.com'
     }]);

    queryInterface.bulkInsert('game_users', [{
      id: 0,
      game_id: 132,
      user_id: 0
     }, {
      id: -1,
      game_id: 132,
      user_id: -1 
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
