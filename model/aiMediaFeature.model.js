const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const AiMediaFeature = sequelize.define('ai_media_features', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  hashId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modelType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageSource: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  thumbnailSource: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  defaultUserImage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageRatio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageResolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'ai_media_features',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = AiMediaFeature;
