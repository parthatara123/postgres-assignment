const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();
// Connecting database
const sequelize = new Sequelize("Restaurants", "postgres", process.env.PASSWORD, {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000
    }
});

module.exports = sequelize;
