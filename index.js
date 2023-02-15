const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
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
  console.log(`Connected to the Apprentice Content Management System Database.`)
);

const menuOptions = [
  "View All Departments",
  "Add Department", 
  "Update Department", 
  "Delete Department",
  "View All Roles", 
  "Add Role", 
  "Delete Role",
  "View All Employees", 
  "View Employees By Role", 
  "Add Employee", 
  "Update Employee Role", 
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
        "Welcome to the Apprentice CMS! Please choose a menu option to get started.",
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
      case "View Employees By Role":
        viewEmployeesByRole();
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
      case "Update Department":
        updateDepartment();
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
  db.query(
    `SELECT department.id AS 'ID', 
    department.department_name AS 'Department' FROM department`,
    function (err, result) {
      if (err) throw err;
      console.table(result);
      mainMenu();
    }
  );
}

// function viewDepartments() {
//   db.query(
//     `SELECT department.id AS 'ID', department_name AS 'Department', 
//             COUNT(employees.id)
//             WHERE employees.role_id = role.department_id 
//             AND role.department_id = department.id) AS 'Total Employees'
//             FROM ((department JOIN role ON department.id  = role.department_id) 
//             JOIN employees ON role.id  = employees.role_id;`,
//     function (err, result) {
//       if (err) throw err;
//       console.table(result);
//       mainMenu();
//     }
//   );
// }

function viewEmployeesByRole() {
  db.query("SELECT * FROM role", function(err, results) {
    inquirer
    .prompt([
      {
        name: "numRole",
        type: "list",
        message: "Please enter the role of the employees you want to view.",
        choices: results.map((result) => {
          return { name: result.title, value: [result.id, result.title] };
        }),
      },
    ])
    .then((answer) => {
    db.query("SELECT first_name, last_name, manager_id FROM employees WHERE role_id = ?", [answer.numRole[0]], function(err, results) {
          if (err) {
            console.log(err);
            viewEmployeesByRole();
          } else if (!results) {
            console.log("No employees currently occupy this role.")
          } else {
            console.table(results);
            mainMenu();
          }
        })
      })
    })
};



function viewRoles() {
  db.query(
    `SELECT role.title AS 'Title', role.salary AS 'Salary', department.department_name AS 'Department' FROM role JOIN department ON role.department_id = department.id`,
    function (err, result) {
      if (err) throw err;
      console.table(result);
      mainMenu();
    }
  );
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

function updateDepartment() {
  db.query(`SELECT * FROM department`, function (err, results) {
    inquirer
      .prompt([ {
        name: "dept",
        type: "list",
        message: "Please choose the department you want to modify.",
        choices: results.map((result) => {
          return { name: result.department_name, value: result.id };
        })
      },
      {
        name: "mod",
        type: "input",
        message: "Please enter the new department name.",
      },
    ]).then((answer) => {
      db.query(
        `UPDATE department SET department_name=? WHERE id=?;`,
        [answer.mod, answer.dept],
        function (err, result) {
          if (err) {
            console.log(err);
            // updateDepartment();
          } else {
            console.log(`Department renamed as ${answer.mod}!`);
            mainMenu();
          }
        }
      );
    });
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
  let managerArray = ["This employee is a manager."];
  let managerNames =[];
  let managers = db.query("SELECT * FROM employees WHERE manager_id IS NULL", function(err, results) {
    if (err) throw err;
    return results.map((result) => {
      // managerArray.push(result.first_name +" "+ result.last_name);
      managerArray.push({
        name: result.first_name + " " + result.last_name,
      value: [result.id, result.first_name + " " + result.last_name]
    });
      // managerNames.push(result.first_name + " " + result.last_name);
    })
  })


  // console.log(managerArray);
  // console.log(managerNames);


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
          type: "list",
          message: "Please enter the manager of the employee to be added.",
          choices:  managerArray
        },
      ])
      .then((answer) => {

        if (answer.manager == "This employee is a manager.") {
          db.query(
            "INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?);",
            [answer.first, answer.last, answer.role],
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
        } else {
        db.query(
          "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
          [answer.first, answer.last, answer.role, answer.manager[0]],
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
      }
    });
  });
}

function deleteDepartment() {
  db.query("SELECT * FROM department", function (err, results) {
    inquirer
      .prompt({
        name: "deptName",
        type: "list",
        message: "Select a department to remove.",
        choices: results.map((result) => {
          return {
            name: result.department_name,
            value: [result.id, result.department_name],
          };
        }),
      })
      .then((answer) => {
        db.query(
          "DELETE from department WHERE id = ?",
          [answer.deptName[0]],
          function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log(`${answer.deptName[1]} removed.`);
              mainMenu();
            }
          }
        );
      });
  });
}

function deleteEmployee() {
  db.query("SELECT * FROM employees", function (err, results) {
    inquirer
      .prompt({
        name: "delEmp",
        type: "list",
        message: "Who would you like to fire?",
        choices: results.map((result) => {
          return {
            name: result.first_name + " " + result.last_name,
            value: [result.id, result.first_name + " " + result.last_name],
          };
        }),
      })
      .then((answer) => {
        db.query(
          "DELETE FROM employees WHERE id = ?",
          [answer.delEmp[0]],
          function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log(`${answer.delEmp[1]}, you're fired.`);
              mainMenu();
            }
          }
        );
      });
  });
}

init();
