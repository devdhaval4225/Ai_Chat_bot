const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const AiToolModel = sequelize.define('aiTool', {
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
    allowNull: true,
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
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('metadata');
      try {
        return JSON.parse(rawValue);
      } catch {
        return rawValue;
      }
    },
  },
  isActive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'aiTool',
  timestamps: true,
});

module.exports = AiToolModel;