'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ai_media_features', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'isActive'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ai_media_features', 'position');
  }
};
