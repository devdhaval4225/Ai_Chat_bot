'use strict';
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aiTool', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hashId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nameAssistant: {
        allowNull: false,
        type: Sequelize.STRING
      },
      assistantId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      tier: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isLatestFeatures: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      isMostFavorite: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      isHomeScreen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      question: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      metadata: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      isActive: {
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
    const aiTools = [
      {
        hashId: `tool_${Math.floor(Math.random() * 1000000)}`,
        nameAssistant: "PDF Summarizer",
        assistantId: "",
        category: "Utility",
        imageUrl: "https://genxai-images.s3.ap-south-1.amazonaws.com/ZapAi+Ai+Assistances+Thumb+Images+JPG+1024kb/PDF_Summarizer.jpg",
        tier: "Free",
        question: null,
      },
      {
        hashId: `tool_${Math.floor(Math.random() * 1000000)}`,
        nameAssistant: "Text Summarizer",
        assistantId: "",
        category: "Utility",
        imageUrl: "https://genxai-images.s3.ap-south-1.amazonaws.com/ZapAi+Ai+Assistances+Thumb+Images+JPG+1024kb/Text_Summarizer.jpg",
        tier: "Free",
        question: null,
      },
      {
        hashId: `tool_${Math.floor(Math.random() * 1000000)}`,
        nameAssistant: "Spell Checker",
        assistantId: "",
        category: "Utility",
        imageUrl: "https://genxai-images.s3.ap-south-1.amazonaws.com/ZapAi+Ai+Assistances+Thumb+Images+JPG+1024kb/Spell_Checker.jpg",
        tier: "Free",
        question: null,
      }
    ]
    await queryInterface.bulkInsert('aiTool', aiTools, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('aiTool');
  }
};

