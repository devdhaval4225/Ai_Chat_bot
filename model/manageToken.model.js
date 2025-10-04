const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const TokenModel =   sequelize.define('manageModelToken', {
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      model: {
        allowNull: false,
        type: DataTypes.STRING
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING
      },
      metadata: {
        allowNull: false,
        type: DataTypes.STRING
      }
    }, {
    tableName: 'manageModelToken' // optional, custom table name
});

module.exports = TokenModel;