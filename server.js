const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);



const promptList = [
  {
    type: "list",
    name: "prompts",
    message: "What would you like to do?",
    choices: [
      "view all employees",
      "view all roles",
      "view all departments",
      "add an employee",
      "add a role",
      "add a department",
      "update employee role",
    ],
  },
];

function startPrompt() {
  inquirer.prompt(promptList).then((response) => {
    if (response.promptList === "view all employees") {
      showEmployees();
    }
    if (response.promptList === "view all roles") {
      showRoles();
    }
    if (response.promptList === "view all departments") {
      showDepartments();
    }
    if (response.promptList === "add an employee") {
      addEmployee();
    }
    if (response.promptList === "add a role") {
      addRole();
    }
    if (response.promptList === "add a department") {
      addDepartment();
    }
    if (response.promptList === "update employee role") {
      updateEmployee();
    }
  });
}

startPrompt();

const showEmployees = () => {
  db.query(
    `SELECT employees.first_name, employees.last_name, roles.job_title AS Job, departments.department_name AS Department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON employees.manager_id = manager.id`,
    (err, results) => {
      console.log("hello world");
      console.table(results);
      startPrompt();
    }
  );
};
const showRoles = () => {
  db.query(
    `SELECT roles.job_title AS role, salary, departments.department_name AS departments FROM roles LEFT OUTER JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name`,
    (err, results) => {
      console.log("hello world2");
      console.table(results);
      startPrompt();
    }
  );
};

const showDepartments = () => {
  db.query(`SELECT * FROM departments`, (err, results) => {
    console.log("hello world3");
    console.table(results);
    startPrompt();
  });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newFirst",
        message: "What is the first name of your new employee?",
      },
      {
        type: "input",
        name: "newLast",
        message: "what is the last name of your new employee?",
      },
    ])
    .then((response) => {
      const newFirstName = response.newFirst;
      const newLastName = response.newLast;
      db.query(
        `SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employees`,
        (err, res) => {
          if (err) throw err;
          let resCount = 0;
          let employeeArr = [];
          for (let i = resCount; i < res.length; i++) {
            let managerList = {
              name: res[i].manager,
              value: res[i].id,
            };
            resCount++;
            employeeArr.push(managerList);
          }
          inquirer
            .prompt([
              {
                type: "list",
                name: "manList",
                message: "who is the employees manager?",
                choices: employeeArr,
              },
            ])
            .then((response) => {
              const managerName = response.manList;
              db.query(`SELECT job_title, id FROM roles`, (err, res) => {
                if (err) throw err;
                let resCount = 0;
                let rolesArr = [];
                for (let i = resCount; i < res.length; i++) {
                  let rolesList = {
                    name: res[i].job_title,
                    value: res[i].id,
                  };
                  resCount++;
                  rolesArr.push(rolesList);
                }
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "rolesList",
                      message: "what is the employees role?",
                      choices: rolesArr,
                    },
                  ])
                  .then((response) => {
                    const employeeRole = response.rolesList;
                    db.query(
                      `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
                      [newFirstName, newLastName, employeeRole, managerName],
                      (err, res) => {
                        if (err) throw err;
                        startPrompt();
                      }
                    );
                  });
              });
            });
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "What role would you like to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
      },
    ])
    .then((response) => {
      const roleName = response.newRole;
      const roleSalary = response.salary;
      db.query(`SELECT department_name, id FROM departments`, (err, res) => {
        if (err) throw err;
        let resCount = 0;
        let departmentArr = [];
        for (let i = resCount; i < res.length; i++) {
          let departmentList = {
            name: res[i].department_name,
            value: res[i].id,
          };
          resCount++;
          departmentArr.push(departmentList);
        }
        // console.log(departmentArr);
        inquirer
          .prompt([
            {
              type: "list",
              name: "depList",
              message: "What department does this role belong to?",
              choices: departmentArr,
            },
          ])
          .then((response) => {
            const departmentName = response.depList;
            db.query(
              `INSERT INTO roles (job_title, salary, department_id) VALUES (?, ?, ?);`,
              [roleName, roleSalary, departmentName],
              (err, res) => {
                if (err) throw err;
                startPrompt();
              }
            );
          });
        // console.log("new role added!");
      });
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "What department would you like to add?",
      },
    ])
    .then((response) => {
      const departmentName = response.newDepartment;
      db.query(
        `INSERT INTO departments (name) VALUES (?)`,
        departmentName,
        (err, res) => {
          if (err) throw err;
        }
      );
      console.log("new department added!");
      startPrompt();
    });
};

const updateEmployee = () => {
  db.query(
    `SELECT id, CONCAT(first_name, " ", last_name) AS employee FROM employees`,
    (err, res) => {
      if (err) throw err;
      let resCount = 0;
      let eArr = [];
      for (let i = resCount; i < res.length; i++) {
        let employeeList = {
          name: res[i].employee,
          value: res[i].id,
        };
        resCount++;
        eArr.push(employeeList);
      }
      inquirer
        .prompt([
          {
            type: "list",
            name: "updateE",
            message: "Which employee would you like to update?",
            choices: eArr,
          },
        ])
        .then((response) => {
          const updateEmp = response.updateE;
          db.query(`SELECT job_title, id FROM roles`, (err, res) => {
            if (err) throw err;
            let resCount = 0;
            let rolesArray = [];
            for (let i = resCount; i < res.length; i++) {
              let rList = {
                name: res[i].job_title,
                value: res[i].id,
              };
              resCount++;
              rolesArray.push(rList);
            }

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "rList",
                  message: "whats your employees new role?",
                  choices: rolesArray,
                },
              ])
              .then((response) => {
                const newERole = response.rList;
                db.query(
                  `UPDATE employees SET role_id = ${newERole} WHERE id = ${updateEmp}`,
                  (err, res) => {
                    if (err) throw err;
                  }
                );
                startPrompt();
              });
          });
        });
    }
  );
};