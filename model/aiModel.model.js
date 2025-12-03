const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const AiModel = sequelize.define('models', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  modelName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  modelType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isPro: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  isActive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reduceToken: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'models',
  timestamps: true
});

module.exports = AiModel;
