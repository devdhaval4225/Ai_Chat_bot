'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('history', {
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
      apiProvider: {
        allowNull: true,
        type: Sequelize.STRING
      },
      apiUseType: {
        allowNull: true,
        type: Sequelize.STRING
      },
      useDateTime: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      totalToken: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      usedToken: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      reminToken: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      metadata: {
        allowNull: true,
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('history');
  }
};
