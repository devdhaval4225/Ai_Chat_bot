'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
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
      uniqueId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
        defaultValue: 0
      },
      planType: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isSubscribe: {
        allowNull: true,
        type: Sequelize.STRING
      },
      expireDate: {
        allowNull: true,
        type: Sequelize.STRING
      },
      metadata: {
        allowNull: true,
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
    await queryInterface.dropTable('users');
  }
};
