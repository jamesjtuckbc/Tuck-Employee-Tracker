const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./connection.js');
const cTable = require('console.table');
const index = require('./index.js');

function view123(table) {
    switch (table) {
        case 'employee':
            viewEmployee();
            break;
        case 'department':
            const departmentQuery = connection.query(`SELECT * FROM department`, function (err, res) {
                if (err) throw err;
                console.table(res);
                // index.init();
            });
            
            break;
        case 'role':
            const roleQuery = connection.query(`SELECT * FROM role`, function (err, res) {
                if (err) throw err;
                console.table(res);
            });
            index.init();
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
                    const empQuery = connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id ORDER BY e.id ASC`, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        index.init();
                    });
                    
                    break;
                case "View All Employees By Role":
                    const empRoleQuery = connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`,{'r.id': roleId}, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                    });
                    index.init();
                    break;
                case "View All Employees By Department":
                    const empDeptQuery = connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`,{'d.id': deptId}, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                    });
                    index.init();
                    break;
                case "View All Employees By Manager":
                    const empMgrQuery = connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`,{'e2.id': mgrId}, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                    });
                    index.init();
                    break;
                case "exit":
                    connection.end();
                    break;
            }
        });
};

function department() {
    
connection.end();
       
};

function role() {

connection.end();
            
};
// module.exports = {
//     view
// }