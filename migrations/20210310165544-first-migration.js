'use stricts'

module.exports = {
  up: {queryInterface, Sequalize) => {
    return queryInterface.createTable(
      'test table',
      {
        id: {
          type: Sequalize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        };
        createdAt: {
          type: sequalize.DATE,
          defaultValue: Sequalize.literal('NOW()'),
          allowNull: false
        },
        testString: {
          type: Sequalize.STRING,
          allowNull: false
        }
      }
    );
  },
  down: (queryInterface, Sequalize) => {
    return queryInterface.dropTable('test_table');
  }
}:
