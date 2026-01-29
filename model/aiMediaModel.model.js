const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const AiMediaModel = sequelize.define('ai_media_models', {
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
    allowNull: true
  },
  featuresType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true
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
    allowNull: true
  },
  proToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reduceToken: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
    resolutions: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'ai_media_models',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

const Resolution = require('./resolution.model');

AiMediaModel.belongsTo(Resolution, { foreignKey: 'resolution_id', as: 'resolution' });
Resolution.hasMany(AiMediaModel, { foreignKey: 'resolution_id' });

module.exports = AiMediaModel;