const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('./config/connection');

connection.connect(function (err) {
    if (err) throw err;

    startPrompt();
});

function startPrompt() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Exit"
        ] 
    })
    .then(function ({ task }) {
        switch (task) {
          case "View all departments":
            viewAllDepartments();
            break;
          case "View all roles":
            viewAllRoles();
            break;
          case "View all employees":
            viewAllEmployees();
            break;
          case "Add a department":
            addDepartment();
            break;
          case "Add a role":
            addRole();
            break;
          case "Add an employee":
            addEmployee();
            break;
          case "Update employee role":
            updateEmployeeRole();
            break;
          case "Exit":
            connection.end();
            break;
        }
    });
}

async function viewAllDepartments() {
    const query = "SELECT * FROM department";
    const rows = await db.query(query);
    console.table(rows);
    return rows; 
};

function viewAllRoles() {
    const query = "SELECT * FROM role";
    const rows = await db.query(query);
    console.table(rows);
    return rows;
};

function viewAllEmployees() {
    const query = "SELECT * FROM employee";
    const rows = await db.query(query);
    console.table(rows);
};

function addDepartment() {

};

function addRole() {

};

function addEmployee() {

};

function updateEmployeeRole() {

};