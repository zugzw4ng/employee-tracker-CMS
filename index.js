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
  console.log("");
  let query = "SELECT * FROM role";
  const rows = db.query(query);
  console.table(rows);
  return rows;
};

async function viewAllEmployees() {
  console.log("");
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
  const employee = fetchEmployeeFullName(employeeInfo.employeeName);
  let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
  let args = [roleId, employee[0], employee[1]];
  const rows = await db.query(query, args);
  console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
};

async function fetchManagerNames() {
  let query = "SELECT * FROM employee WHERE manager_id IS NULL";
  const rows = await db.query(query);
  let employeeNames = [];
  for (const employee of rows) {
    employeeNames.push(employee.first_name + " " + employee.last_name);
  }
  return employeeNames;
}

async function fetchRoleNames() {
  let query = "SELECT title FROM role";
  const rows = await db.query(query);
  let roles = [];
  for (const row of rows) {
    roles.push(row.title);
  }
  return roles;
}

async function fetchDepartmentNames() {
  let query = "SELECT name FROM department";
  const rows = await db.query(query);
  let departments = [];
  for (const row of rows) {
    departments.push(row.name);
  }
  return departments;
}

async function fetchEmployeeNames() {
  let query = "SELECT * FROM employee";
  const rows = await db.query(query);
  let employeeNames = [];
  for (const employee of rows) {
    employeeNames.push(employee.first_name + " " + employee.last_name);
  }
  return employeeNames;
}

async function fetchRoleId(roleName) {
  let query = "SELECT * FROM role WHERE role.title=?";
  let args = [roleName];
  const rows = await db.query(query, args);
  return rows[0].id;
}

async function fetchDepartmentId(departmentName) {
  let query = "SELECT * FROM department WHERE department.name=?";
  let args = [departmentName];
  const rows = await db.query(query, args);
  return rows[0].id;
}


async function fetchEmployeeId(fullName) {
  let employee = fetchEmployeeFullName(fullName);
  let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
  let args = [employee[0], employee[1]];
  const rows = await db.query(query, args);
  return rows[0].id;
}

function fetchEmployeeFullName(fullName) {
  let employee = fullName.split(" ");
  if (employee.length == 2) {
    return employee;
  }

  const last_name = employee[employee.length - 1];
  let first_name = " ";
  for (let i = 0; i < employee.length - 1; i++) {
    first_name = first_name + employee[i] + " ";
  }
  return [first_name.trim(), last_name];
}



async function start() {
  let exitMenu = false;
  while (!exitMenu) {
    const prompt = await startPrompt();

    switch (prompt.action) {
      case 'Add department': {
        const newDepartmentName = await fetchDepartmentNames();
        await addNewDepartment(newDepartmentName);
        break;
      }

      case 'Add employee': {
        const newEmployee = await fetchNewEmployeeInfo();
        console.log("add an employee");
        console.log(newEmployee);
        await addNewEmployee(newEmployee);
        break;
      }

      case 'Add role': {
        const newRole = await ();
        console.log("add a role");
        await addNewRole(newRole);
        break;
      }

      case 'Update employee role': {
        const employee = await ();
        await updateEmployeeRole(employee);
        break;
      }

      case 'View all departments': {
        await viewAllDepartments();
        break;
      }

      case 'View all employees': {
        await viewAllEmployees();
        break;
      }
      case 'View all roles': {
        await viewAllRoles();
        break;
      }

      case 'Exit': {
        exitMenu = true;
        process.exit(0);
      }
    }
  }
}

process.on("exit", async function () {
  await db.close();
  return console.log(`Exiting the application`);
});

start();


