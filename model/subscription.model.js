const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const SubscriptionHistory = sequelize.define('subscription_history', {
    deviceId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    currentPlan: {
      allowNull: false,
      type: DataTypes.STRING
    },
    currentToken: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    newToken: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    isUpDown: {
      allowNull: false,
      type: DataTypes.STRING
    },
    plusMinusToken: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
}, {
  tableName: 'subscription_history' // optional, custom table name
});

module.exports = SubscriptionHistory;
