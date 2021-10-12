const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const dotEnv = require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
});


