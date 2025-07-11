const { Sequelize } = require('sequelize');
require("dotenv").config();

// Example connection
const pass = process.env.DB_PASSWORD || '';
const username = process.env.DB_USERNAME
const dbName = process.env.DB_NAME
const dbHost = process.env.DB_HOST || 'localhost';
const dialect = process.env.DB_DIALECT || 'mysql';

const sequelize = new Sequelize(dbName, username, pass, {
  host: dbHost,
  dialect: dialect,
  logging: false, // set to true to see raw SQL logs
});

module.exports = sequelize;
