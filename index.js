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

async function startPrompt() {
  return inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "Add employee",
          "Update employee role",
          "View all roles",
          "Add role",
          "View all departments",
          "Add department",
          "Exit"
        ]
      }
    ])
}

async function fetchNewEmployeeInfo() {
  const managers = await fetchManagerNames();
  const roles = await fetchRoleNames();
  return inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "role",
        choices: [...roles]
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager",
        choices: [...managers]
      }
    ])
}
async function fetchNewDeptInfo() {
  return inquirer
  .prompt([
      {
          type: "input",
          message: "What is the name of the new department?",
          name: "departmentName"
      }
  ])
}


async function fetchNewRoleInfo() {
  const departments = await fetchDepartmentNames();
  return inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the new role?",
        name: "roleName"
      },
      {
        type: "input",
        message: "What is the salary of the new role?",
        name: "salary"
      },
      {
        type: "list",
        message: "Which department uses this role?",
        name: "departmentName",
        choices: [...departments]
      }
    ])
}

async function fetchUpdatedRoleInfo() {
  const employees = await fetchEmployeeNames();
  const roles = await fetchRoleNames();
  return inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee do you want to update?",
        name: "employeeName",
        choices: [...employees]
      },
      {
        type: "list",
        message: "What is the employee's new role?",
        name: "role",
        choices: [...roles]
      }
    ])

}

async function start() {
  let exitMenu = false;
  while (!exitMenu) {
    const prompt = await startPrompt();

    switch (prompt.action) {
      case 'Add department': {
        const newDepartmentName = await fetchNewDeptInfo();
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
        const newRole = await fetchNewRoleInfo();
        console.log("add a role");
        await addNewRole(newRole);
        break;
      }

      case 'Update employee role': {
        const employee = await fetchUpdatedRoleInfo();
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


