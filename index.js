const mysql = require("mysql2");
const inquirer = require("inquirer");
const consTable = require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    //mySQL Username
    user: process.env.DB_USERNAME,
    //mySQL Password
    password: process.env.DB_PASSWORD,
    database: "cms_db",
  },
  console.log(`Connected to the content management system database.`)
);

const menuOptions = [
  "View All Departments",
  "View All Roles",
  "View All Employees",
  "Add Department",
  "Add Role",
  "Add Employee",
  "Update Employee Role",
  "Delete Department",
  "Delete Role",
  "Terminate Employee",
  "Exit Menu",
];

const init = () => {
  console.clear();
  mainMenu();
};

const mainMenu = () => {
  inquirer
    .prompt({
      message:
        "Welcome to your CMS! Please choose a menu option to get started.",
      name: "menu",
      type: "list",
      choices: menuOptions,
    })
    .then((answers) => {
      processAnswer(answers.menu);
    });
};

const processAnswer = (choice) => {
  switch (choice) {
    case "View All Departments":
      viewDepartments();
      break;
    case "View All Roles":
      viewRoles();
      break;
    case "View All Employees":
      viewEmployees();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Add Role":
      addRole();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Update Employee Role":
      updateEmployee();
      break;
    case "Delete Department":
      deleteDepartment();
      break;
    case "Delete Role":
      deleteRole();
      break;
    case "Terminate Employee":
      deleteEmployee();
      break;
    case "Exit Menu":
      db.end();
      break;
    default:
      db.end();
      break;
  }
};

function viewDepartments() {
  db.query("SELECT department_name FROM department", function (err, result) {
    if (err) throw err;
    console.table(result);
    mainMenu();
  });
}

function viewRoles() {
  db.query(
    "SELECT role.title AS 'Title', role.salary AS 'Salary', department.department_name AS 'Department' FROM role LEFT JOIN department ON role.department_id = department.id", function (err, result) {
    if (err) throw err;
    console.table(result);
    mainMenu();
  });
}

function viewEmployees() {
  db.query(
    `SELECT 
  employees.id, 
  first_name, 
  last_name, 
  title, 
  salary, 
  department_name,
  manager_id 
  FROM ((department JOIN role ON department.id = role.department_id) 
  JOIN employees ON role.id = employees.role_id);`,

    function (err, result) {
      if (err) throw err;
      console.table(result);
      mainMenu();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please enter the name of the department to be added.",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO department (department_name) VALUES (?);",
        [answer.department],
        function (err, result) {
          if (err) {
            console.log(err);
            addDepartment();
          } else {
            console.log(`${answer.department} added!`);
            mainMenu();
          }
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM department", function (err, results) {
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Please enter the title of the role to be added.",
        },
        {
          name: "salary",
          type: "input",
          message: "Please enter the salary of the role to be added.",
        },
        {
          name: "dept",
          type: "list",
          message: "Please enter the department ID of the role to be added.",
          choices: results.map((result) => {
            return { name: result.department_name, value: result.id };
          }),
        },
      ])
      .then((answer) => {
        db.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);",
          [answer.title, answer.salary, answer.dept],
          function (err, result) {
            if (err) {
              console.log(err);
              addRole();
            } else {
              console.log(`${answer.title} added to roles!`);
              mainMenu();
            }

          }
        );
      });
  });
}

function addEmployee() {
  
  db.query("SELECT * FROM role;", function (err, results) {
    inquirer
      .prompt([
        {
          name: "first",
          type: "input",
          message: "Please enter the first name of the employee to be added.",
        },
        {
          name: "last",
          type: "input",
          message: "Please enter the last name of the employee to be added.",
        },
        {
          name: "role",
          type: "list",
          message: "Please enter the role ID of the employee to be added.",
          choices: results.map((result) => {
            return { name: result.title, value: result.id };
          }),
        },
        {
          name: "manager",
          type: "input",
          message: "Please enter the manager ID of the employee to be added.",
        },
      ])
      .then((answer) => {
        db.query(
          "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
          [answer.first, answer.last, answer.role, answer.manager],
          function (err, results) {
            if (err) {
              console.log(err);
              addEmployee();
            } else {
              console.log(
                `${answer.first + " " + answer.last} added to employees!`
              );
              mainMenu();
            }
          }
        );
      });
  });
}

function deleteDepartment() {
  db.query("SELECT * FROM department", function(err, results) {
    inquirer.prompt({
      name: "deptName",
      type: "list",
      message: "Select a department to remove.",
      choices: results.map((result) => {
        return {name: result.department_name, value: result.department_name}
      })
    })
    .then((answer) => {
      db.query("DELETE from department WHERE department_name = ?", 
      [answer.deptName], 
      function(err, results) {
        if (err) {
          console.log(err)
        } else {
          console.log(`${answer.deptName} removed.`);
          mainMenu();
        }
      })
    })
  })
};

function deleteEmployee() {
  db.query("SELECT * FROM employees", function(err, results) {
  inquirer
  .prompt({
    name: "delEmp",
    type: "list",
    message: "Who would you like to fire?",
    choices: results.map((result) => { 
    return {name: result.first_name + " " + result.last_name, value: [result.id, result.first_name + " " + result.last_name]}
  })
  })
  .then((answer) => {
    db.query("DELETE FROM employees WHERE id = ?", [answer.delEmp[0]], function(err, results){
      if (err){
        console.log(err)
      } else {
        console.log(`${answer.delEmp[1]}, you're fired.`);
        mainMenu();
      }
    })
})
})
}

init();
