'use strict';

module.exports = {
  up: async (sequelize, DataTypes) => {
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
      }
    });

    /* ============================
     * ==== message table =========
     * ============================ */
    sequelize.createTable('message', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'account',
          key: 'id'
        }
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      loc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'game',
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
      },
      next_card: {
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
      num_players: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      started: {
        type: DataTypes.SMALLINT,
        allowNull: false
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
        allowNull: false,
        references: {
          model: 'game',
          key: 'id'
        }
      },
      account_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
          model: 'account',
          key: 'id'
        }
      },
      player_num: {
        type: DataTypes.SMALLINT,
        allowNull: true
      }
    });
    /* ============================
     * ==== game_card table =======
     * ============================ */
    sequelize.createTable('game_card', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      card_status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
          model: 'player',
          key: 'id'
        }
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'game',
          key: 'id'
        }
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'card',
          key: 'id'
        }
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }); // end of game card_table
  }, // end of up
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('card');
      await queryInterface.dropTable('account');
      await queryInterface.dropTable('player');
      await queryInterface.dropTable('game');
      await queryInterface.dropTable('user');
  }
};
