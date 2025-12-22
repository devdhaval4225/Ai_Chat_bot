'use strict';
const shortid = require('shortid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const planArr = [
      {
        planId: `new-user`,
        planName: "New User",
        planSlug: "new-user",
        token: 5,
        isActive: 0,
        type: "new-user"
      }
    ]
    await queryInterface.bulkInsert('plan', planArr, {});
  },

  async down(queryInterface, Sequelize) {

  }
};
