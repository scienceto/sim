// Import Sequelize and define connection
const { Sequelize, DataTypes } = require('sequelize');
const process = require('node:process');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
});

module.exports = {
    sequelize,
    DataTypes
};