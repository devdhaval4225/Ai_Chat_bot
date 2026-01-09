'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add thumbnail to models
    await queryInterface.addColumn('models', 'thumbnail', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'imageUrl'
    });

    // Add position to assistant
    await queryInterface.addColumn('assistant', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'isActive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('models', 'thumbnail');
    await queryInterface.removeColumn('assistant', 'position');
  }
};
