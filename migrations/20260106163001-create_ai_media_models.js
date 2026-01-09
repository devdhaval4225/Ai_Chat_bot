'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ai_media_models', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      modelName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      modelType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      model: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      thumbnail: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isPro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      isActive: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      proToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reduceToken: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('ai_media_models');
  }
};
