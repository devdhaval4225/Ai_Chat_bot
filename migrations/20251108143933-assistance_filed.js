'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('assistant', 'isHomeScreen', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      after: 'isMostFavorite'
    });
    await queryInterface.addColumn('assistant', 'hashId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('assistant', 'isHomeScreen');
    await queryInterface.removeColumn('assistant', 'hashId');
  }
};