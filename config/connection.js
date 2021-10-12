const mySql = require("mysql2");

const connection = mySql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3001,
    database: "employees_db"
});

module.exports = connection;
