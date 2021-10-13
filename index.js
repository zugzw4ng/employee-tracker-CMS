const inquirer = require('inquirer');
const consoleTable = require('console.table');
let Connection = require('./config/connection');
require('dotenv').config()


const db = new Connection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employees_db"
})
async function startPrompt() {
  let exitMenu = false;
  while (!exitMenu) {
    const prompt = await menuPrompt();
  }
  switch (prompt.action) {
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
      exitMenu = true;
      process.exit(0);
      return;
  }
};


async function viewAllDepartments() {
  let query = "SELECT * FROM department";
  const rows = db.query(query);
  console.table(rows);
  return rows;
};

async function viewAllRoles() {
  let query = "SELECT * FROM role";
  const rows = db.query(query);
  console.table(rows);
  return rows;
};

async function viewAllEmployees() {
  let query = "SELECT * FROM employee";
  const rows = db.query(query);
  console.table(rows);
};

async function addDepartment(departmentInfo) {
  const departmentName = departmentInfo.departmentName;
  let query = 'INSERT into department (name) VALUES (?)';
  let args = [departmentName];
  const rows = db.query(query, args);
  console.log(`Added department named ${departmentName}`);
};

async function addRole(roleInfo) {
  const departmentId = await getDepartmentId(roleInfo.departmentName);
  const salary = roleInfo.salary;
  const title = roleInfo.roleName;
  let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
  let args = [title, salary, departmentId];
  const rows = db.query(query, args);
  console.log(`Added role ${title}`);
};

async function addEmployee() {
  const roleId = await getRoleId(employeeInfo.role);
  const managerId = await getEmployeeId(employeeInfo.manager);
  let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
  const args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
  const rows = db.query(query, args);
  console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
};

async function updateEmployeeRole(employeeInfo) {
  const roleId = await getRoleId(employeeInfo.role);
  const employee = getFirstAndLastName(employeeInfo.employeeName);

  let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
  let args = [roleId, employee[0], employee[1]];
  const rows = db.query(query, args);
  console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
};