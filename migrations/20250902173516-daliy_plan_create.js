'use strict';
const shortid = require('shortid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const planArr = [
      {
        planId: `daily-L!M!T`,
        planName: "Daliy Limit",
        planSlug: "daliy-limit",
        token: 3,
        isActive: 1,
        type: "daliy-limit"
      }
    ]
    await queryInterface.bulkInsert('plan', planArr, {});
  },

  async down(queryInterface, Sequelize) {

  }
};
