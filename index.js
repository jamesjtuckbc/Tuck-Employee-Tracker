const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./connection.js');
const db = require('./db/db.js');
const { getDepartments, getRoles } = require('./db/db.js');


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
                        viewDepartment();
                        break;
                    case "View Roles":
                        viewRole();
                        break;
                    case "Add Employee":
                        addEmployee();
                        break;
                    case "Add Department":
                        addDepartment();
                        break;
                    case "Add Role":
                        addRole();
                        break;
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
                case "back":
                    init();
                    break;
                case "exit":
                    connection.end();
                    break;
            }
        });
};

async function addEmployee() {
    const depts = await db.getDepartments();
    const deptChoices = depts.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: "First name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "Last name?",
        },
        {
            name: "dept",
            type: "list",
            message: "Department?",
            choices: deptChoices,
        }]).then(async function (answer) {
            const roles = await db.getRoles(answer.dept);
            const roleChoices = roles.map(({ title, id }) => ({
                name: title,
                value: id
            }));
            inquirer
                .prompt({
                    name: "role",
                    type: "list",
                    message: "Role?",
                    choices: roleChoices
                }).then(async function (answer2) {
                    const mgrs = await db.getManagers(answer2.role);
                    const mgrChoices = mgrs.map(({ name, id }) => ({
                        name: name,
                        value: id
                    }));
                    inquirer
                        .prompt({
                            name: "mgr",
                            type: "list",
                            message: "Manager?",
                            choices: mgrChoices
                        }).then(function (answer3) {
                            connection.query(`INSERT INTO employee SET ?`, { 'first_name': answer.firstName, 'last_name': answer.lastName, 'role_id': answer2.role, 'manager_id': answer3.mgr }, function (err, res) {
                                if (err) throw err;
                                if (res.affectedRows >= 1) {
                                    console.log('\n' + 'New employee added!' + '\n');
                                }
                                init();
                            });
                        })
                });




        })


};


function addDepartment() {
    inquirer
        .prompt({
            name: "dept",
            type: "input",
            message: "Department name?",
        }).then(function (answer){
            connection.query(`INSERT INTO department SET ?`, { 'name': answer.dept}, function (err, res) {
                if (err) throw err;
                if (res.affectedRows >= 1) {
                    console.log('\n' + 'New Department added!' + '\n');
                }
                init();
            });
        })
};


async function addRole() {
    const depts = await db.getDepartments();
    const deptChoices = depts.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    const valSalary = (salary) => {
        if (/^[\d]+$/g.test(salary)) {
            return true;
        } else {
            console.log(` - Please use numbers only`);
            return false;
        }
    };
    inquirer
        .prompt([{
            name: "dept",
            type: "list",
            message: "Department?",
            choices: deptChoices,
        },
        {
            name: "title",
            type: "input",
            message: "Role name?",
        },
        {
            name: "salary",
            type: "input",
            message: "Salary?",
            validate: (salary) => valSalary(salary)

        }]).then(function (answer){
            connection.query(`INSERT INTO role SET ?`, { 'title': answer.title, 'salary':answer.salary, 'department_id':answer.dept}, function (err, res) {
                if (err) throw err;
                if (res.affectedRows >= 1) {
                    console.log('\n' + 'New Role added!' + '\n');
                }
                init();
            });
        })
};

async function viewDepartment() {
    const dept = await db.getDepartments()
    console.log('\n');
    console.table(dept);
    init();
};
async function viewRole() {
    const role = await db.getRoles()
    console.log('\n');
    console.table(role);
    init();
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

