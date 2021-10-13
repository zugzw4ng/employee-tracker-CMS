const inquirer = require('inquirer');
const consoleTable = require('console.table');
let Connection = require('./config/connection');
require('dotenv').config()


const db = new Connection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employees_db"
});


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
  const rows = await db.query(query);
  console.table(rows);
};

async function addNewDepartment(departmentInfo) {
  const departmentName = departmentInfo.departmentName;
  let query = 'INSERT into department (name) VALUES (?)';
  let args = [departmentName];
  const rows = await db.query(query, args);
  console.log(`Added department named ${departmentName}`);
};

async function addNewRole(roleInfo) {
  const departmentId = await fetchDepartmentId(roleInfo.departmentName);
  const salary = roleInfo.salary;
  const title = roleInfo.roleName;
  let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
  let args = [title, salary, departmentId];
  const rows = await db.query(query, args);
  console.log(`Added role ${title}`);
};

async function addNewEmployee() {
  const roleId = await fetchRoleId(employeeInfo.role);
  const managerId = await fetchEmployeeId(employeeInfo.manager);
  let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
  const args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
  const rows = await db.query(query, args);
  console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
};

async function updateEmployeeRole(employeeInfo) {
  const roleId = await fetchRoleId(employeeInfo.role);
  const employee = fetchFirstAndLastName(employeeInfo.employeeName);
  let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
  let args = [roleId, employee[0], employee[1]];
  const rows = await db.query(query, args);
  console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
};

async function fetchManagerNames() {
  let query = "SELECT * FROM employee WHERE manager_id IS NULL";
  const rows = await db.query(query);
  let employeeNames = [];
  for(const employee of rows) {
      employeeNames.push(employee.first_name + " " + employee.last_name);
  }
  return employeeNames;
}

async function fetchRoles() {
  let query = "SELECT title FROM role";
  const rows = await db.query(query);
  let roles = [];
  for(const row of rows) {
      roles.push(row.title);
  }
  return roles;
}

async function fetchDepartmentNames() {
  let query = "SELECT name FROM department";
  const rows = await db.query(query);
  let departments = [];
  for(const row of rows) {
      departments.push(row.name);
  }
  return departments;
}

async function fetchDepartmentId(departmentName) {
  let query = "SELECT * FROM department WHERE department.name=?";
  let args = [departmentName];
  const rows = await db.query(query, args);
  return rows[0].id;
}

async function fetchRoleId(roleName) {
  let query = "SELECT * FROM role WHERE role.title=?";
  let args = [roleName];
  const rows = await db.query(query, args);
  return rows[0].id;
}

async function fetchEmployeeId(fullName) {
  let employee = fetchFirstAndLastName(fullName);

  let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
  let args=[employee[0], employee[1]];
  const rows = await db.query(query, args);
  return rows[0].id;
}