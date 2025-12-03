'use strict';
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
     const [openAi] = await queryInterface.sequelize.query(`SELECT token FROM manageModelToken WHERE type = 'openAi' LIMIT 1`);
     const [mistal] = await queryInterface.sequelize.query(`SELECT token FROM manageModelToken WHERE type = 'mistralAi' LIMIT 1`);
     const [gemini] = await queryInterface.sequelize.query(`SELECT token FROM manageModelToken WHERE type = 'gemini' LIMIT 1`);
     const [deepSeek] = await queryInterface.sequelize.query(`SELECT token FROM manageModelToken WHERE type = 'deepSeek' LIMIT 1`);
    await queryInterface.createTable('models', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      modelName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      modelType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      isPro: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      isActive: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      proToken: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      reduceToken: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
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
    const modelList = [
      {
        modelName: "ChatGPT",
        modelType: "openAi",
        model: "gpt-4o-mini",
        imageUrl: "https://genxai-images.s3.ap-south-1.amazonaws.com/ZapAi+Ai+Assistances+Thumb+Images+JPG+1024kb/OpenAI.png",
        isPro: 0,
        token: openAi[0]["token"],
        proToken: openAi[0]["token"],
        reduceToken: 1,
      },
      {
        modelName: "Mistral",
        modelType: "mistralAi",
        model: "mistral-large-latest",
        imageUrl: "https://genxai-images.s3.ap-south-1.amazonaws.com/ZapAi+Ai+Assistances+Thumb+Images+JPG+1024kb/Mistral.png",
        isPro: 0,
        token: mistal[0]["token"],
        proToken: mistal[0]["token"],
        reduceToken: 1,
      },
      {
        modelName: "Deepseek",
        modelType: "deepSeek",
        model: "deepseek-reasoner",
        imageUrl: "https://genxai-images.s3.ap-south-1.amazonaws.com/ZapAi+Ai+Assistances+Thumb+Images+JPG+1024kb/Deepseek.png",
        isPro: 0,
        token: gemini[0]["token"],
        proToken: gemini[0]["token"],
        reduceToken: 1,
      },
      {
        modelName: "Gemini",
        modelType: "gemini",
        model: "gemini-1.5-flash",
        imageUrl: "https://genxai-images.s3.ap-south-1.amazonaws.com/ZapAi+Ai+Assistances+Thumb+Images+JPG+1024kb/Gemini.png",
        isPro: 0,
        token: deepSeek[0]["token"],
        proToken: deepSeek[0]["token"],
        reduceToken: 1,
      },
    ]
    await queryInterface.bulkInsert('models', modelList, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('models');
  }
};

