const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Category = sequelize.define('categories', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = Category;
