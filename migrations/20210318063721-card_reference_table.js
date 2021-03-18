'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /* ============================
     * ==== card table ============
     * ============================ */
    await queryInterface.createTable('card_reference', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      number: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
    queryInterface.bulkInsert('card_reference', [{
      label: 'number'
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('card_reference');
  }
};
