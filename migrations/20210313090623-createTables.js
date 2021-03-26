'use strict';

module.exports = {
  up: async (sequelize, DataTypes) => {
    /* ============================
     * ==== user table ============
     * ============================ */
    await sequelize.createTable('user', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    });

    /* ============================
     * ==== account table =========
     * ============================ */
    sequelize.createTable('account', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      win_count: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      user_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    });

    /* ============================
     * ==== game table ============
     * ============================ */
    sequelize.createTable('game', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      date_created: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    });

    /* ============================
     * ==== player table ==========
     * ============================ */
    sequelize.createTable('player', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      game_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
          model: 'game',
          key: 'id'
        }
      },
      user_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    });
    /* ============================
     * ==== card table ============
     * ============================ */
    sequelize.createTable('card', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      card_status: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
          model: 'player',
          key: 'id'
        }
      },
      number: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('card');
      await queryInterface.dropTable('account');
      await queryInterface.dropTable('player');
      await queryInterface.dropTable('game');
      await queryInterface.dropTable('user');
  }
};
