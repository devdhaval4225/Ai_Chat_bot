const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const User = sequelize.define('users', {
  deviceId: {
    type: DataTypes.STRING,
    unique: true
  },
  totalToken: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  uniqueId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  appId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  usedToken: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  reminToken: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  planType: {
    allowNull: true,
    type: DataTypes.STRING
  },
  isSubscribe: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  expireDate: {
    allowNull: true,
    type: DataTypes.DATE
  },
  metadata: {
    allowNull: true,
    type: DataTypes.STRING
  }
}, {
  tableName: 'users' // optional, custom table name
});

module.exports = User;
