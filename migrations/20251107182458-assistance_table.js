'use strict';
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assistant', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nameAssistant: {
        allowNull: false,
        type: Sequelize.STRING
      },
      assistantId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      tier: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isLatestFeatures: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      isMostFavorite: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      question: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      metadata: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      isActive: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
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
    await queryInterface.dropTable('assistant');
  }
};

