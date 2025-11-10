'use strict';
require("dotenv").config();
const { uniqueNumber } = require("../common/commonFunction");


module.exports = {
  async up(queryInterface, Sequelize) {

    try {
      const [assistants] = await queryInterface.sequelize.query(`SELECT id FROM assistant`);

      for (let i = 0; i < assistants.length; i++) {
        const id = assistants[i]["id"]
        const hashId = `asst_${Math.floor(Math.random() * 1000000)}`
        await queryInterface.sequelize.query(
          `UPDATE assistant SET \`hashId\` = :hashId WHERE id = :id`,
          {
            replacements: { hashId, id },
          }
        );
      }
    } catch (error) {
      console.log("---error----", error)
    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'assistant',
      { hashId: null },
      {}
    );
  }

};