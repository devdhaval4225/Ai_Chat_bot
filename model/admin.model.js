const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Admin = sequelize.define(
    'admin',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        token: {
            allowNull: true,
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'admin',
        timestamps: true, // createdAt & updatedAt
    }
);

module.exports = Admin;
