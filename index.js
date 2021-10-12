const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./config/connection');

db.connect(function (err) {
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

async function viewAllRoles() {
    const query = "SELECT * FROM role";
    const rows = await db.query(query);
    console.table(rows);
    return rows;
};

async function viewAllEmployees() {
    const query = "SELECT * FROM employee";
    const rows = await db.query(query);
    console.table(rows);
};

async function addDepartment() {

};

async function addRole() {
    const departmentId = await getDepartmentId(roleInfo.departmentName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
    let args = [title, salary, departmentId];
    const rows = await db.query(query, args);
    console.log(`Added role ${title}`);
};

async function addEmployee() {
    const roleId = await getRoleId(employeeInfo.role);
    const managerId = await getEmployeeId(employeeInfo.manager);
    const query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    const args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
    const rows = await db.query(query, args);
    console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
};

async function updateEmployeeRole() {

};