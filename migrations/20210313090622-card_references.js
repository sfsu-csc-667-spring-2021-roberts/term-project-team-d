'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /* ============================
     * == card reference table ====
     * ============================ */
    await queryInterface.createTable('card', {
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
      }, 
      effect: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
    queryInterface.bulkInsert('card', [{
      number: 0,
      color: 'red',
      type: 'normal'
    }, {
      number: 1,
      color: 'red',
      type: 'normal'
    }, {
      number: 2,
      color: 'red',
      type: 'normal'
    }, {
      number: 3,
      color: 'red',
      type: 'normal'
    }, {
      number: 4,
      color: 'red',
      type: 'normal'
    }, {
      number: 5,
      color: 'red',
      type: 'normal'
    }, {
      number: 6,
      color: 'red',
      type: 'normal'
    }, {
      number: 7,
      color: 'red',
      type: 'normal'
    }, {
      number: 8,
      color: 'red',
      type: 'normal'
    }, {
      number: 9,
      color: 'red',
      type: 'normal'
    }, {
      number: 0,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 1,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 2,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 3,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 4,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 5,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 6,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 7,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 8,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 9,
      color: 'yellow',
      type: 'normal'
    }, {
      number: 0,
      color: 'blue',
      type: 'normal'
    }, {
      number: 1,
      color: 'blue',
      type: 'normal'
    }, {
      number: 2,
      color: 'blue',
      type: 'normal'
    }, {
      number: 3,
      color: 'blue',
      type: 'normal'
    }, {
      number: 4,
      color: 'blue',
      type: 'normal'
    }, {
      number: 5,
      color: 'blue',
      type: 'normal'
    }, {
      number: 6,
      color: 'blue',
      type: 'normal'
    }, {
      number: 7,
      color: 'blue',
      type: 'normal'
    }, {
      number: 8,
      color: 'blue',
      type: 'normal'
    }, {
      number: 9,
      color: 'blue',
      type: 'normal'
    }, {
      number: 0,
      color: 'green',
      type: 'normal'
    }, {
      number: 1,
      color: 'green',
      type: 'normal'
    }, {
      number: 2,
      color: 'green',
      type: 'normal'
    }, {
      number: 3,
      color: 'green',
      type: 'normal'
    }, {
      number: 4,
      color: 'green',
      type: 'normal'
    }, {
      number: 5,
      color: 'green',
      type: 'normal'
    }, {
      number: 6,
      color: 'green',
      type: 'normal'
    }, {
      number: 7,
      color: 'green',
      type: 'normal'
    }, {
      number: 8,
      color: 'green',
      type: 'normal'
    }, {
      number: 9,
      color: 'green',
      type: 'normal'
    }, 
     /*============================
     * ===== SPECIAL CARDS ========
     * ============================ */

    /* ============================
     * ====== Draw 2 ==============
     * ============================ */
    {
      number: -1,
      color: 'red',
      type: 'draw 2'
    }, {
      number: -1,
      color: 'yellow',
      type: 'draw 2'
    }, {
      number: -1,
      color: 'blue',
      type: 'draw 2'
    }, {
      number: -1,
      color: 'green',
      type: 'draw 2'
    },
    /* ============================
     * ====== Reverse Card ========
     * ============================ */
      {
      number: -1,
      color: 'red',
      type: 'reverse'
    }, {
      number: -1,
      color: 'yellow',
      type: 'reverse'
    }, {
      number: -1,
      color: 'blue',
      type: 'reverse'
    }, {
      number: -1,
      color: 'green',
      type: 'reverse'
    },
    /* ============================
     * ====== Skip Card ===========
     * ============================ */
      {
      number: -1,
      color: 'red',
      type: 'skip'
    }, {
      number: -1,
      color: 'yellow',
      type: 'skip'
    }, {
      number: -1,
      color: 'blue',
      type: 'skip'
    }, {
      number: -1,
      color: 'green',
      type: 'skip'
    },
    /* ============================
     * ====== Draw 4 ==============
     * ============================ */
      {
      number: -1,
      color: 'none',
      type: 'draw 4'
    }, {
      number: -1,
      color: 'none',
      type: 'draw 4'
    }, {
      number: -1,
      color: 'none',
      type: 'draw 4'
    }, {
      number: -1,
      color: 'none',
      type: 'draw 4'
    },
    /* ============================
     * == Change Color Card =======
     * ============================ */
      {
      number: -1,
      color: 'none',
      type: 'changeColor',
    }, {
      number: -1,
      color: 'none',
      type: 'changeColor',
    }, {
      number: -1,
      color: 'none',
      type: 'changeColor',
    }, {
      number: -1,
      color: 'none',
      type: 'changeColor',
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('card');
  }
};
