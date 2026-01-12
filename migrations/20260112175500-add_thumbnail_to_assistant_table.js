'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('assistant', 'thumbnail', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'imageUrl'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('assistant', 'thumbnail');
  }
};
