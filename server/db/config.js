// db/config.js - Database Configuration
const { Sequelize } = require('sequelize');

// Configure your database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'spaceapp',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // mysql, postgres, sqlite, mariadb or mssql
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;