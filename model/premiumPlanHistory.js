const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const PremiumPlanHistory = sequelize.define('premium_plan_history', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    purchaseToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    timestamp: {
        allowNull: false,
        type: DataTypes.DATE
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    purchaseState: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subscriptionType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    promoCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'premium_plan_history'
});

module.exports = PremiumPlanHistory;
