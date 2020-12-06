const mysql = require('mysql');
const connection = require('../connection.js');


class DB {
    constructor(connection) {
        this.connection = connection;
    }
    getRoles(dept) {
        if(dept == null) {
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name AS "department name" FROM role r LEFT JOIN department d ON r.department_id = d.id')
        } else if (dept === 'mappable'){
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name FROM role r LEFT JOIN department d ON r.department_id = d.id')
        } else {
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name AS "department name" FROM role r LEFT JOIN department d ON r.department_id = d.id WHERE ?',{'d.id':dept})
        }
    }
    getDepartments() {
        return this.connection.query('SELECT d.id, d.name, SUM(r.salary) as "salary cost" FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e ON r.id = e.role_id GROUP BY d.id, d.name ORDER BY SUM(r.salary) DESC')

    }
    getManagers(role) {
        if(role == null){
            return this.connection.query('SELECT DISTINCT e.id, CONCAT(e.first_name, " ", e.last_name) AS "name" FROM employee e JOIN employee e2 ON e.id = e2.manager_id')
        } else {
            return this.connection.query('SELECT DISTINCT e.id, CONCAT(e.first_name, " ", e.last_name) AS "name" FROM employee e JOIN employee e2 ON e.id = e2.manager_id WHERE ?', {'e.role_id': role})
        }
    }
    getEmployee(by, value) {
        switch(by) {
            case 'nice':
                return this.connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id ORDER BY e.id ASC`)
            case 'all':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id ORDER BY e.id ASC`)
            case 'dept':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'d.id': value})
            case 'role':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'r.id': value})
            case 'mgr':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'e2.id': value})
            case 'salary':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'r.id': value})
        }
    }
};








// async function getRoles() {
//     const query = await connection.query('SELECT id, title FROM role', (err,res) => {
//         if(err){
//             console.log(err);
//              return err
//             };
//         console.table(res);
//         return res;

//     });
//     return query;
//     // console.log(roleQuery);
// }








module.exports = new DB(connection);