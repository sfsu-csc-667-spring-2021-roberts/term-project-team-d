'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    Promise.all([
      queryInterface.bulkInsert('hand', [{
        hand_id: 0
      }, {
        hand_id: 1
      }])], [
      queryInterface.bulkInsert('card_stack', [{
        card_stack_id: 0
      }, {
        card_stack_id: 1
      }])], [
      queryInterface.bulkInsert('game_room', [{
        game_room_id: 0
      }, {
        game_room_id: 1
      }])], [
      queryInterface.bulkInsert('card', [{
        hand_id: 0,
        card_stack_id: 0
      }, {
        hand_id: 1,
        card_stack_id: 1
      }])], [
      queryInterface.bulkInsert('player', [{
        player_id: 0,
        hand_id: 0,
        game_room_id: 0
      }, {
        player_id: 1,
        hand_id: 1,
        game_room_id: 1
      }])]
    );
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all(
      [queryInterface.bulkDelete('player')],
      [queryInterface.bulkDelete('card')],
      [queryInterface.bulkDelete('game_room')],
      [queryInterface.bulkDelete('card_stack')],
      [queryInterface.bulkDelete('hand')],
    );
  }
};
