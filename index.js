const mysql = require("mysql2");
const inquirer = require("inquirer");
const consTable = require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      //mySQL Username
      user: process.env.DB_USERNAME,
      //mySQL Password
      password: process.env.DB_PASSWORD,
      database: 'cms_db'
    },
    console.log(`Connected to the content management system database.`)
  );


  const menuOptions = [ 
    'View All Departments',
    'View All Roles',
    'View All Employees',
    'Add Department',
    'Add Role',
    'Add Employee',
    'Update Employee Role',
    'Delete Department',
    'Delete Role',
    'Terminate Employee',
    'Exit Menu',
  ];

  

  const init = () => {
    console.clear();
    mainMenu();
  }


  const mainMenu = () => {
    inquirer.prompt({
      message: 'Welcome to your CMS! Please choose a menu option to get started.',
      name: 'menu',
      type: 'list',
      choices: menuOptions
    })
    .then(answers => {
      processAnswer(answers.menu)
    })
  }

  const processAnswer = (choice) => {
    switch(choice) {
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
        }
    }

    
function viewDepartments() {
  db.query('SELECT * FROM department;', function(err, result) {
    if(err){
      console.log("No Departments In Database");
    } else {
    console.table(result); 
    mainMenu();
  }
})
}

function viewRoles() {
  db.query('SELECT * FROM role;', function(err, result) {
    if(err){
      console.log("No Roles In Database");
    } else {
    console.table(result); 
    mainMenu();
  }
})
}

function viewEmployees() {
  db.query('SELECT * FROM employees;', function(err, result) {
    if(err){
      console.log("No Employees In Database");
    } else {
    console.table(result); 
    mainMenu();
  }
})
}

function addDepartment() {
inquirer.prompt([
  {
  name: 'department',
  type: 'input',
  message: 'Please enter the name of the department to be added.'
},
])
.then(answer => {
  db.query('INSERT INTO department (name) VALUES (?);',
  [answer.department],
  function(err, result) {
    if(err) {
      console.log("Entry must be a valid input.");
      addDepartment();
    } else {
      console.log(`${answer.department} added!`);
      mainMenu();
    }
  })
})
}

function addRole() {
  inquirer.prompt([
    {
    name: 'title',
    type: 'input',
    message: 'Please enter the title of the role to be added.'
  },
  {
    name: 'salary',
    type: 'input',
    message: 'Please enter the salary of the role to be added.'
  },
  {
    name: 'dept',
    type: 'input',
    message: 'Please enter the department ID of the role to be added.'
  },
  ])
  .then(answer => {
    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);',
    [answer.title, answer.salary, answer.dept],
    function(err, result) {
      if(err) {
        console.log("Entry must be a valid input.");
        addRole();
      } else {
        console.log(`${answer.title} added to roles!`);
        mainMenu();
      }
    })
  })
  }

  function addEmployee() {
    db.query('SELECT * FROM role;', function(err, results){
    inquirer.prompt([
      {
      name: 'first',
      type: 'input',
      message: 'Please enter the first name of the employee to be added.'
    },
    {
      name: 'last',
      type: 'input',
      message: 'Please enter the last name of the employee to be added.'
    },
    {
      name: 'role',
      type: 'list',
      message: 'Please enter the role ID of the employee to be added.',
      choices: results.map((result) => {
        return {name: result.title, value: result.id}
      })
    },
    // {
    //   name: 'manager',
    //   type: 'input',
    //   required: false,
    //   message: 'Please enter the manager ID of the employee to be added.'
    // },
    ])
    .then(answer => {
      db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?);',
      [answer.first, answer.last, answer.role],
      function(err, results) {
        if(err) {
          console.log("Entry must be a valid input.");
          addEmployee();
        } else {
          console.log(`${answer.first + " " + answer.last} added to employees!`);
          mainMenu();
        }
      })
    })
    })
  }

init();
  

