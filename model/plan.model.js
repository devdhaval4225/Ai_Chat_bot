const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Plan = sequelize.define('plan', {
    planId: {
        allowNull: false,
        type: DataTypes.STRING
    },
    planName: {
        allowNull: false,
        type: DataTypes.STRING
    },
    planSlug: {
        allowNull: false,
        type: DataTypes.STRING
    },
    token: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    isActive: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    type: {
        allowNull: false,
        type: DataTypes.STRING
    },
}, {
    tableName: 'plan' // optional, custom table name
});

module.exports = Plan;
