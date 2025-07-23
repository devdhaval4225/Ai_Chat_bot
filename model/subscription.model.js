const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const SubscriptionHistory = sequelize.define('subscription_history', {
    deviceId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    currentPlanId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    currentToken: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    newPlanId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    newPlanToken: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    isUpDown: {
      allowNull: false,
      type: DataTypes.ENUM('up', 'down')
    },
    newRefreshToken: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
}, {
  tableName: 'subscription_history'
});

module.exports = SubscriptionHistory;
