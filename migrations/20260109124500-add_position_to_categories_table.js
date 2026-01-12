'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'position');
  }
};
