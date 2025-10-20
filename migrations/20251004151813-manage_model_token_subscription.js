'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('manageModelToken', 'subscribe_model', {
      type: Sequelize.TEXT,
      allowNull: false,
      after: 'model'
    });
    await queryInterface.addColumn('manageModelToken', 'subscribe_token', {
      type: Sequelize.TEXT,
      allowNull: false,
      after: 'token'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('manageModelToken', 'subscribe_model');
    await queryInterface.removeColumn('manageModelToken', 'subscribe_token');
  }
};