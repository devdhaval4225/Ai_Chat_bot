'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscription_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      currentPlan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      currentToken: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      newToken: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      isUpDown: {
        allowNull: false,
        type: Sequelize.STRING
      },
      plusMinusToken: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscription_history');
  }
};

