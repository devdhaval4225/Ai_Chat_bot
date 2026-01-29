'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('ai_media_models');
    
    // Check if column 'resolutions' exists before adding
    if (!tableInfo.resolutions) {
      await queryInterface.addColumn('ai_media_models', 'resolutions', {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }

    // Clean up old columns if they exist (from the previous attempt)
    if (tableInfo.resolution_id) {
      await queryInterface.removeColumn('ai_media_models', 'resolution_id');
    }
    if (tableInfo.selected_resolution_types) {
      await queryInterface.removeColumn('ai_media_models', 'selected_resolution_types');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ai_media_models', 'resolutions');
  }
};
