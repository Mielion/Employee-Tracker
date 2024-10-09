//we use the relative route ./, and this is very different than /
// importing modules
import inquirer from "inquirer";
import { connection } from "./database/connection.js";


// delcaring quesions and prompting
const employeeQuestions = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "employee",
      choices: [
        "View all Employees",
        "Add Employee",
        "Update Employee",
        "View all Roles",
        "Add Role",
        "View all Departments",
        "Add Department",
        "Quit",
      ],
    })
    .then((answers) => {
      switch (answers.employee) {
        case "View all Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "View all Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View all Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          process.exit(0);
      }
    });
};

// functions to handle the prompts

const viewAllDepartments = function () {
  connection.query("SELECT * FROM department", (error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.table(result.rows);
    }
  });
};

const viewAllEmployees = async () => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    from employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
    `,
    (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.table(result.rows);
        employeeQuestions();
      }
    }
  );
};

const addEmployee = async () => {
  try {
    const roles = await connection.query(`SELECT id, title from role;`);
    const rolesFormatted = roles.rows.map(role => ({name: role.title, value: role.id}));

    const employees = await connection.query(`SELECT id, first_name, last_name from employee;`);
    const employeesFormatted = employees.rows.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));

    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "employeerole",
        choices: rolesFormatted
      },
      {
        type: "list",
        message: "What is the employee's manager?",
        name: "manager",
        choices: employeesFormatted
      },
    ]);

    const results = await connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`, [answers.first_name, answers.last_name, answers.employeerole, answers.manager]);

    console.table(results.rows);
    employeeQuestions();
  } catch (error) {
    console.error(error)
  }
};

const updateEmployee = async () => {
  try {
    const roles = await connection.query(`SELECT id, title from role;`);
    const rolesFormatted = roles.rows.map(role => ({name: role.title, value: role.id}));

    const employees = await connection.query(`SELECT id, first_name, last_name from employee;`);
    const employeesFormatted = employees.rows.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));

    const answers = await inquirer.prompt([
            {
        type: "list",
        message: "Which employee's role do you want to update?",
        name: "employeeSelected",
        choices: employeesFormatted
      },
      {
        type: "list",
        message: "Which role do you want to assign the selected employee?",
        name: "employeeNewRole",
        choices: rolesFormatted
      },
    ]);

    const results = await connection.query(`UPDATE employee SET role_id = $1 WHERE id = $2 returning *;`, [answers.employeeNewRole, answers.employeeSelected]);

    console.table(results.rows);
    employeeQuestions();
  } catch (error) {
    console.error(error)
  }


};

const viewAllRoles = async () => {
  connection.query(
    `SELECT role.id, role.title, role.salary, department.name AS department from role
		INNER JOIN department ON role.department_id = department.id;
		`,
    (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.table(result.rows);
        employeeQuestions();
      }
    }
  );
};

const addRole = async () => {
  try {
    const departments = await connection.query(`SELECT id, name from department;`);
    const departmentsFormatted = departments.rows.map(dept => ({name: dept.name, value: dept.id}));
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "name",
      },
      {
        type: "input",
        message: "What is the salary of role?",
        name: "salary",
      },
      {
        type: "list",
        message: "Which department does the role belong to?",
        name: "departmentname",
        choices: departmentsFormatted
      },
    ]);

    const results = await connection.query(`INSERT INTO role(title, salary, department_id) VALUES ($1, $2, $3);`, [answers.name, answers.salary, answers.departmentname]);

    console.table(results.rows);
    employeeQuestions();
  } catch (error) {
    console.error(error)
  }
};

const addDepartment = async () => {
  inquirer
    .prompt({
      type: "input",
      name: "department",
      message: "What is the name of the department?",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department (name) VALUES ($1);",
        [answer.department],
        (error, result) => {
          if (error) {
            console.error(error);
          } else {
            employeeQuestions();
          }
        }
      );
    });
};

employeeQuestions();
