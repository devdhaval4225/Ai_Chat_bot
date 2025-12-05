'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('aiTool', 'model', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'gpt-4o-mini',
      after: 'assistantId'
    });

    await queryInterface.addColumn('assistant', 'model', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'gpt-4o-mini',
      after: 'assistantId'
    });

    // Ensure older rows get the correct value too
    await queryInterface.bulkUpdate('aiTool', { model: 'gpt-4o-mini' }, {});
    await queryInterface.bulkUpdate('assistant', { model: 'gpt-4o-mini' }, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('aiTool', 'model');
    await queryInterface.removeColumn('assistant', 'model');
  }
};
