'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add featuresType to ai_media_models
    await queryInterface.addColumn('ai_media_models', 'featuresType', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'modelType'
    });

    // 2. Add featuresType to ai_media_features
    await queryInterface.addColumn('ai_media_features', 'featuresType', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'modelType'
    });

    // 3. Data Migration: featuresType = modelType, modelType = null
    // Models Table
    await queryInterface.sequelize.query('UPDATE ai_media_models SET featuresType = modelType, modelType = NULL');
    
    // Features Table
    await queryInterface.sequelize.query('UPDATE ai_media_features SET featuresType = modelType, modelType = NULL');
  },

  async down(queryInterface, Sequelize) {
    // Restore data
    await queryInterface.sequelize.query('UPDATE ai_media_models SET modelType = featuresType');
    await queryInterface.sequelize.query('UPDATE ai_media_features SET modelType = featuresType');

    // Remove columns
    await queryInterface.removeColumn('ai_media_models', 'featuresType');
    await queryInterface.removeColumn('ai_media_features', 'featuresType');
  }
};
