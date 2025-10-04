const { Sequelize } = require('sequelize');
require("dotenv").config();

// Example connection
const pass = process.env.NODE_ENV == "production" ? process.env.P_DB_PASSWORD : process.env.DB_PASSWORD;
const username = process.env.NODE_ENV == "production" ? process.env.P_DB_USERNAME : process.env.DB_USERNAME
const dbName = process.env.NODE_ENV == "production" ? process.env.P_DB_NAME : process.env.DB_NAME
const dbHost = process.env.NODE_ENV == "production" ? process.env.P_DB_HOST : process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbName, username, pass, {
  host: dbHost,
  dialect: dialect,
  logging: false, // set to true to see raw SQL logs
});

module.exports = sequelize;
