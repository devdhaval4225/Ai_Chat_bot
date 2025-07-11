const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const History = sequelize.define('history', {
  deviceId: {
    type: DataTypes.STRING,
    unique: true
  },
  apiProvider: {
    allowNull: true,
    type: DataTypes.STRING
  },
  apiUseType: {
    allowNull: true,
    type: DataTypes.STRING
  },
  useDateTime: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  totalToken: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  useToken: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  reminToken: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
}, {
  tableName: 'history' // optional, custom table name
});

module.exports = History;
