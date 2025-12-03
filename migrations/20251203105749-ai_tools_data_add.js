  'use strict';

  module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`
        UPDATE aiTool
        SET assistantId = 'asst_8XphHk5hHVolGxVPfMkQqf5i'
        WHERE nameAssistant = 'Text Summarizer';
      `);

      await queryInterface.sequelize.query(`
        UPDATE aiTool
        SET assistantId = 'asst_Yshc3HmPy5zJuCbTAcjze0r1'
        WHERE nameAssistant = 'Spell Checker';
      `);
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`
        UPDATE aiTool
        SET assistantId = NULL
        WHERE nameAssistant = 'Text Summarizer';
      `);

      await queryInterface.sequelize.query(`
        UPDATE aiTool
        SET assistantId = NULL
        WHERE nameAssistant = 'Spell Checker';
      `);
    }
  };
