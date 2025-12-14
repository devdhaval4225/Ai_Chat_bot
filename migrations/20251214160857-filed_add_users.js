'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'appId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'uniqueId'
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'appId');
  }
};
