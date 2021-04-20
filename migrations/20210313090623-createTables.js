'use strict';

module.exports = {
  up: async (sequelize, DataTypes) => {
    /* ============================
     * ==== users table ===========
     * ============================ */
    await sequelize.createTable('users', {
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    });

    /* ============================
     * ==== games table ===========
     * ============================ */
    await sequelize.createTable('games', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      date_created: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      last_card: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      current_player: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      clockwise: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      started: {
        type: DataTypes.SMALLINT,
        allowNull: false
      }
    });

    /* ============================
     * ==== messages table =========
     * ============================ */
    await sequelize.createTable('messages', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id'
        }
      }
    });

    /* ============================
     * ==== game_users table ======
     * ============================ */
    await sequelize.createTable('game_users', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      game_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id'
        }
      },
      user_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      player_num: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      winner: {
        type: DataTypes.SMALLINT,
        allowNull: true
      }
    });
    /* ============================
     * ==== game_cards table ======
     * ============================ */
    await sequelize.createTable('game_cards', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      card_status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id'
        }
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'cards',
          key: 'id'
        }
      },
      card_order: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }); // end of game card_table
  }, // end of up
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('game_cards');
      await queryInterface.dropTable('game_users');
      await queryInterface.dropTable('messages');
      await queryInterface.dropTable('games');
      await queryInterface.dropTable('users');
      await queryInterface.dropTable('cards');
  }
};
