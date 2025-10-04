'use strict';
require("dotenv").config();

const openAiToken = process.env.OPEN_AI_API_KEY
const mistalToken = process.env.MISTRAL_AI_API_KEY
const geminiToken = process.env.GEMINI_API_KEY
const deepToken = process.env.DEEPSEEK_API_KEY

const openAiModel = 'gpt-4o'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('manageModelToken', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      metadata: {
        allowNull: false,
        type: Sequelize.STRING
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

    const planArr = [
      {
        type: `openAi`,
        name: "OpenAi",
        model: "",
        token: openAiToken,
      },
      {
        type: `openAichatCompletion`,
        name: "OpenAi Only For Use Chat Completion",
        model: openAiModel,
        token: openAiToken,
      },
      {
        type: `openAiPdf`,
        name: "OpenAi Only For Use PDF Summary",
        model: "",
        token: openAiToken,
      },
      {
        type: `mistralAi`,
        name: "MistralAi",
        model: "mistral-large-latest",
        token: mistalToken,
      },
      {
        type: `gemini`,
        name: "Gemini",
        model: "gemini-1.5-flash",
        token: geminiToken,
      },
      {
        type: `deepSeek`,
        name: "Deep Seek",
        model: "deepseek-reasoner",
        token: deepToken,
      },
      {
        type: `openAi-summarizerBot`,
        name: "Summarizer Bot",
        model: "",
        token: openAiToken,
      },
      {
        type: `openAi-spellCheckerBot`,
        name: "Spell Checker Bot",
        model: "",
        token: openAiToken,
      },
    ]
    await queryInterface.bulkInsert('manageModelToken', planArr, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('manageModelToken');
  }
};

