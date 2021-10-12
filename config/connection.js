const mySql = require("mysql2");

const connection = mySql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;
