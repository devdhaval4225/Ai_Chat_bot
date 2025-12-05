'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('aiTool', 'reduceToken', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      after: 'category'
    });

    await queryInterface.addColumn('assistant', 'reduceToken', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      after: 'category'
    });

    // Ensure older rows get the correct value too
    await queryInterface.bulkUpdate('aiTool', { reduceToken: 1 }, {});
    await queryInterface.bulkUpdate('assistant', { reduceToken: 1 }, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('aiTool', 'reduceToken');
    await queryInterface.removeColumn('assistant', 'reduceToken');
  }
};
