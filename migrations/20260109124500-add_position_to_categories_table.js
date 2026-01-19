'use strict';

/** @type {import('sequelize-cli').Migration} */

// OLD CODE - COMMENTED OUT
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.addColumn('categories', 'position', {
//       type: Sequelize.INTEGER,
//       allowNull: true,
//       defaultValue: null
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.removeColumn('categories', 'position');
//   }
// };

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};
