const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const apiLog = sequelize.define('apiLogs', {
    deviceId: {
        allowNull: false,
        type: DataTypes.STRING
    },
    method: {
        allowNull: false,
        type: DataTypes.STRING
    },
    url: {
        allowNull: false,
        type: DataTypes.STRING
    },
    statusCode: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    body: {
        allowNull: false,
        type: DataTypes.JSON
    },
    responseTimeMs: {
        allowNull: false,
        type: DataTypes.STRING
    },
    cpuUserTimeMs: {
        allowNull: false,
        type: DataTypes.STRING
    },
    cpuSystemTimeMs: {
        allowNull: false,
        type: DataTypes.STRING
    },
}, {
    tableName: 'apiLogs'
});

module.exports = apiLog;