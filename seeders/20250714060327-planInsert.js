'use strict';
const shortid = require('shortid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const planArr = [
      {
        planId: `free-${shortid.generate()}`,
        planName: "Free",
        planSlug: "free",
        token: 5,
        isActive:1,
        type: "personal"
      },
      {
        planId: `week-${shortid.generate()}`,
        planName: "Week",
        planSlug: "week",
        token: 10,
        isActive:1,
        type: "personal"
      },
      {
        planId: `month-${shortid.generate()}`,
        planName: "Month",
        planSlug: "month",
        token: 100,
        isActive:1,
        type: "personal"
      },

  ]
      await queryInterface.bulkInsert('plan', planArr, {});
  },

  async down (queryInterface, Sequelize) {

  }
};
