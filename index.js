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
  "Modify Role",
  "Delete Role",
  "View All Employees",
  "View Employees By Role",
  "Add Employee",
  "Update Employee",
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
    case "Modify Role":
      modRole();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Update Employee":
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
  db.query("SELECT * FROM role", function (err, results) {
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
        db.query(
          "SELECT first_name, last_name, manager_id FROM employees WHERE role_id = ?",
          [answer.numRole[0]],
          function (err, results) {
            if (err) {
              console.log(err);
              viewEmployeesByRole();
            } else if (!results) {
              console.log("No employees currently occupy this role.");
            } else {
              console.table(results);
              mainMenu();
            }
          }
        );
      });
  });
}

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
      .prompt([
        {
          name: "dept",
          type: "list",
          message: "Please choose the department you want to modify.",
          choices: results.map((result) => {
            return { name: result.department_name, value: result.id };
          }),
        },
        {
          name: "mod",
          type: "input",
          message: "Please enter the new department name.",
        },
      ])
      .then((answer) => {
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

function modRole() {
  db.query("SELECT * FROM role", function (err, results) {
    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Select a role to rename.",
          choices: results.map((result) => {
            return {
              name: result.title,
              value: [result.id, result.title],
            };
          }),
        },
        {
          name: "mod",
          type: "input",
          message: "What would you like to rename this role?",
        },
      ])
      .then((answer) => {
        db.query(
          `UPDATE role 
           SET title=?
           WHERE id=?;`,
          [answer.mod, answer.role[0]],
          function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log(`Role renamed as ${answer.mod}.`);
              mainMenu();
            }
          }
        );
      });
  });
}

function addEmployee() {
  let managerArray = [
    {
      name: "This employee is in a managerial position.",
      value: [null, "This employee is in a managerial position."],
    },
  ];
  let managerNames = [];

  db.query(
    "SELECT * FROM employees WHERE manager_id IS NULL",
    function (err, results) {
      if (err) throw err;
      return results.map((result) => {
        // managerArray.push(result.first_name +" "+ result.last_name);
        managerArray.push({
          name: result.first_name + " " + result.last_name,
          value: [result.id, result.first_name + " " + result.last_name],
        });
        // managerNames.push(result.first_name + " " + result.last_name);
      });
    }
  );

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
          choices: managerArray,
        },
      ])
      .then((answer) => {
        if (answer.manager === "This employee is a manager.") {
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
        } else if (answer.manager !== "This employee is a manager.") {
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

function updateEmployee() {
  let managerArray = [
    {
      name: "This employee is in a managerial position.",
      value: [null, "This employee is in a managerial position."],
    },
  ];
  let employeeArray = [];

  db.query(
    "SELECT * FROM employees WHERE manager_id IS NULL",
    function (err, results) {
      if (err) throw err;
      return results.map((result) => {
        // managerArray.push(result.first_name +" "+ result.last_name);
        managerArray.push({
          name: result.first_name + " " + result.last_name,
          value: [result.id, result.first_name + " " + result.last_name],
        });
        // managerNames.push(result.first_name + " " + result.last_name);
      });
    }
  );

  db.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    return results.map((result) => {
      // managerArray.push(result.first_name +" "+ result.last_name);
      employeeArray.push({
        name: result.first_name + " " + result.last_name,
        value: [
          result.id,
          result.first_name + " " + result.last_name,
          result.role_id,
          result.manager_id,
        ],
      });
      // managerNames.push(result.first_name + " " + result.last_name);
    });
  });

  db.query("SELECT * FROM employees;", function (err, results) {
    inquirer
      .prompt([
        {
          name: "modMe",
          type: "list",
          message: "Select an employee to update.",
          choices: employeeArray,
        },
        {
          name: "updateWhat",
          type: "list",
          message: "What do you want to update?",
          choices: ["Role", "Change Manager", "Name", "Cancel Update"],
        },
      ])
      .then((answer) => {
        let employeeProfile = [answer.modMe[0], answer.modMe[1]];

        switch (answer.updateWhat) {
          case "Role":
            db.query("SELECT * FROM role", function (err, results) {
              inquirer
                .prompt({
                  name: "role",
                  type: "list",
                  message: "Which role are you assigning this employee?",
                  choices: results.map((result) => {
                    return {
                      name: result.title,
                      value: [result.id, result.title],
                    };
                  }),
                })
              })
                .then((answer) => {
                  db.query(
                    `UPDATE employees
                SET role_id=?
                WHERE id=?`,
                    [answer.role[0], employeeProfile[0]],
                    function (err, results) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(
                          `Employee role updated to ${answer.role[1]}.`
                        );
                        mainMenu();
                      }
                    }
                  );
                });
            break;

          case "Change Manager":
            inquirer
              .prompt([
                {
                  name: "manager",
                  type: "list",
                  message:
                    "Select a manager for this employee to be managed by, or update their managerial status.",
                  choices: managerArray,
                },
              ])
              .then((answer) => {
                if (answer.manager === "This employee is a manager.") {
                  db.query(
                    `UPDATE employees
                      SET manager_id=?
                      WHERE id=?;`,
                    [answer.manager[0], employeeProfile[0]],
                    function (err, results) {
                      if (err) {
                        console.log(err);
                        updateEmployee();
                      } else {
                        console.log(`${employeeProfile[1]} assigned managerial status!`);
                        mainMenu();
                      }
                    }
                  );
                } else if (answer.manager !== "This employee is a manager.") {
                  db.query(
                    `UPDATE employees
                      SET manager_id=?
                      WHERE id=?`,
                    [answer.manager[0], employeeProfile[0]],
                    function (err, results) {
                      if (err) {
                        console.log(err);
                        updateEmployee();
                      } else {
                        console.log(
                          `${answer.manager[1]} has been reassigned to be ${employeeProfile[1]}'s manager!`
                        );
                        mainMenu();
                      }
                    }
                  );
                }
              });
            break;

          case "Name":
            db.query(
              `SELECT * FROM employees WHERE id=?`,
              employeeProfile[0],
              function (err, results) {
                if (err) {
                  console.log(err);
                } else {
                  inquirer
                    .prompt([
                      {
                        name: "name",
                        type: "list",
                        message:
                          "Would you like to change the first or last name of this employee in the database?",
                        choices: ["First", "Last", "Both"],
                      },
                    ])
                    .then((answer) => {
                      switch (answer.name) {
                        case "First":
                          inquirer
                            .prompt([
                              {
                                name: "newName",
                                type: "input",
                                message: "Please input the new first name",
                              },
                            ])
                            .then((answer) => {
                              db.query(
                                `UPDATE employees 
                            SET first_name=?
                            WHERE id=?`,
                                [answer.newName, employeeProfile[0]],
                                function (err, results) {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    console.log(
                                      `Employee first name changed to ${answer.newName}!`
                                    );
                                    mainMenu();
                                  }
                                }
                              );
                            });            
                            break;

                        case "Last":
            inquirer
              .prompt([
                {
                  name: "newName",
                  type: "input",
                  message: "Please input the new last name",
                },
              ])
              .then((answer) => {
                db.query(
                  `UPDATE employees 
                              SET last_name=?
                              WHERE id=?`,
                  [answer.newName, employeeProfile[0]],
                  function (err, results) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(
                        `Employee last name changed to ${answer.newName}!`
                      );
                      mainMenu();
                    }
                  }
                )
              });
            break;

          case "Both":
            inquirer
              .prompt([
                {
                  name: "newFirst",
                  type: "input",
                  message: "Please input the new first name",
                },
                {
                  name: "newLast",
                  type: "input",
                  message: "Please input the new last name",
                }
              ])
              .then((answer) => {
                db.query(
                  `UPDATE employees 
                                SET first_name=?,
                                last_name=?
                                WHERE id=?`,
                  [answer.newFirst, answer.newLast, employeeProfile[0]],
                  function (err, results) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(
                        `Employee name changed to ${answer.newFirst} ${answer.newLast}!`
                      );
                      mainMenu();
                    }
                  }
                )
              });
            break;

          case "Cancel Update":
            mainMenu();
            break;
                }})
      }});
  }});
})
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

function deleteRole() {
  db.query("SELECT * FROM role", function (err, results) {
    inquirer
      .prompt({
        name: "roleName",
        type: "list",
        message: "Select a role to remove.",
        choices: results.map((result) => {
          return {
            name: result.title,
            value: [result.id, result.title],
          };
        }),
      })
      .then((answer) => {
        db.query(
          "DELETE from role WHERE id = ?",
          [answer.roleName[0]],
          function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log(`${answer.roleName[1]} removed.`);
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

