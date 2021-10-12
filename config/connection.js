const mySql = require("mysql2");
require('dotenv').config();

const connection = mySql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "employees_db"
});

module.exports = connection;
