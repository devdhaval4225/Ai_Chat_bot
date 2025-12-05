const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const AssistantModel = sequelize.define('assistant', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  hashId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameAssistant: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assistantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isLatestFeatures: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  isMostFavorite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  isHomeScreen: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
    // parse JSON automatically when fetching
    get() {
      const rawValue = this.getDataValue('question');
      try {
        return JSON.parse(rawValue);
      } catch {
        return rawValue;
      }
    },
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('metadata');
      try {
        return JSON.parse(rawValue);
      } catch {
        return rawValue;
      }
    },
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "gpt-4o-mini",
  },
  reduceToken: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  isActive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'assistant',
  timestamps: true,
});

module.exports = AssistantModel;