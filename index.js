const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./connection.js');
const db = require('./db/db.js');


    init();


async function init() {
    await
        inquirer
            .prompt({
                name: "initQuestion",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View Employees",
                    "View Departments",
                    "View Roles",
                    "Add Employee",
                    "Add Department",
                    "Add Role",
                    "Update Employees",
                    "Update Department",
                    "Update Role",
                    "Remove Employee",
                    "Remove Department",
                    "Remove Role",
                    "exit"
                ]
            })
            .then(function (answer) {
                switch (answer.initQuestion) {
                    case "View Employees":
                        viewEmployee();
                        break;
                    case "View Departments":
                        view('department');
                        break;
                    case "View Roles":
                        view('role');
                        break;
                    // case "Add Employee":
                    //     addEmployee();
                    //     break;
                    // case "Add Department":
                    //     addDepartment();
                    //     break;
                    // case "Add Role":
                    //     addRole();
                    //     break;
                    // case "Update Employees":
                    //     updateEmployee();
                    //     break;
                    // case "Update Department":
                    //     updateDepartment();
                    //     break;
                    // case "Update Role":
                    //     updateRole();
                    //     break;
                    // case "Remove Employee":
                    //     removeEmployee();
                    //     break;
                    // case "Remove Department":
                    //     removeDepartment();
                    //     break;
                    // case "Remove Role":
                    //     removeRole();
                    //     break;
                    case "exit":
                        connection.end();
                        break;
                }
            });
};

function view(table) {
    switch (table) {
        case 'employee':
            viewEmployee();
            break;
        case 'department':
            const departmentQuery = connection.query(`SELECT * FROM department`, function (err, res) {
                if (err) throw err;
                console.log('\n');
                console.table(res);
                // init();
            });

            break;
        case 'role':
            const roleQuery = connection.query(`SELECT * FROM role`, function (err, res) {
                if (err) throw err;
                console.log('\n');
                console.table(res);
            });
            init();
            break;

    }
};

function viewEmployee() {
    inquirer
        .prompt({
            name: "viewEmployee",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Role",
                "View All Employees By Department",
                "View All Employees By Manager",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.viewEmployee) {

                case "View All Employees":
                    connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id ORDER BY e.id ASC`, function (err, res) {
                        if (err) throw err;
                        console.log('\n');
                        console.table(res);
                        init();
                    });

                    break;
                case "View All Employees By Role":
                    empRole();
                    break;
                case "View All Employees By Department":
                    empDept();
                    break;
                case "View All Employees By Manager":
                    empMgr();
                    break;
                case "exit":
                    connection.end();
                    break;
            }
        });
};

async function empRole() {
    const roles = await db.getRoles();
    const roleChoices = roles.map(({ title, id }) => ({
        name: title,
        value: id
    }));
    inquirer
        .prompt({
            name: "viewEmpRole",
            type: "list",
            message: "Role?",
            choices: roleChoices
        })
        .then(function (answer) {
            console.log(answer.viewEmpRole);
            connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, { 'r.id': answer.viewEmpRole }, function (err, res) {
                if (err) throw err;
                console.log('\n');
                console.table(res);
            });

            init();
        });
};
async function empDept() {
    const depts = await db.getDepartments();
    const deptChoices = depts.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    inquirer
        .prompt({
            name: "viewEmpDept",
            type: "list",
            message: "Department?",
            choices: deptChoices
        })
        .then(function (answer) {
            connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, { 'd.id': answer.viewEmpDept }, function (err, res) {
                if (err) throw err;
                console.log('\n');
                console.table(res);
            });
            init();
        });
};
async function empMgr() {
    const mgrs = await db.getManagers();
    const mgrChoices = mgrs.map(({ name, id }) => ({
        name: name,
        value: id
    }));
    inquirer
        .prompt({
            name: "viewEmpMgr",
            type: "list",
            message: "Manager?",
            choices: mgrChoices
        })
        .then(function (answer) {
            connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, { 'e2.id': answer.viewEmpMgr }, function (err, res) {
                if (err) throw err;
                console.log('\n');
                console.table(res);
            });
            init();
        });
};

