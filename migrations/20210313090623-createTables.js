'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /* ============================
    * ==== hand table ============
    * ============================ */
    await queryInterface.createTable(
     'hand',
     {
       id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
       },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
          allowNull: false
        }
      }
    );
    /* ============================
     * ==== card table ============
     * ============================ */
    await queryInterface.createTable(
      'card',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        hand_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'hand',
            key: 'id'
          },
          onUpdate: 'restrict',
          onDelete: 'restrict'
        }
      }
    );
    /* ============================
     * ==== player table ==========
     * ============================ */
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('card');
      await queryInterface.dropTable('player');
      await queryInterface.dropTable('game');
      await queryInterface.dropTable('hand');
  }
};
