require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,   // ✅ This now uses 'localhost'
    dialect: process.env.DB_DIALECT
  },
  production: {
    username: process.env.P_DB_USERNAME,
    password: process.env.P_DB_PASSWORD,
    database: process.env.P_DB_NAME,
    host: process.env.P_DB_HOST,   // ✅ This now uses 'localhost'
    dialect: process.env.DB_DIALECT
  }
};
