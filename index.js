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
          case "Add A Department":
          addDepartment();
          break;
          case "Add A Role":
          addRole();
          break;
          case "Add An Employee":
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

    
const viewDepartments = () => {
  db.query('SELECT * FROM department', function(err, result) {
    if(!result){
      console.log("No Departments In Database");
    } else {
    console.table(result); 
    mainMenu();
  }
})
}

const viewRoles = () => {
  db.query('SELECT * FROM role', function(err, result) {
    if(!result){
      console.log("No Roles In Database");
    } else {
    console.table(result); 
    mainMenu();
  }
})
}

const viewEmployees = () => {
  db.query('SELECT * FROM employees', function(err, result) {
    if(!result){
      console.log("No Employees In Database");
    } else {
    console.table(result); 
    mainMenu();
  }
})
}

init();
  

