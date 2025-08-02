'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('apiLogs', {
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
      method: {
        allowNull: false,
        type: Sequelize.STRING
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      statusCode: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      body: {
        allowNull: false,
        type: Sequelize.JSON
      },
      responseTimeMs: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cpuUserTimeMs: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cpuSystemTimeMs: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('apiLogs');
  }
};

