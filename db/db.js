const mysql = require('mysql');
const connection = require('../connection.js');


class DB {
    constructor(connection) {
        this.connection = connection;
    }
    getRoles(dept) {
        if(dept == null) {
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name AS "department name" FROM role r LEFT JOIN department d ON r.department_id = d.id')
        } else {
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name AS "department name" FROM role r LEFT JOIN department d ON r.department_id = d.id WHERE ?',{'d.id':dept})
        }
        
    }
    getDepartments() {
        return this.connection.query('SELECT d.id, d.name, SUM(r.salary) as "salary cost" FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e ON r.id = e.role_id GROUP BY d.id, d.name ORDER BY SUM(r.salary) DESC')

    }
    getManagers(role) {
        if(role == null){
            return this.connection.query('SELECT DISTINCT e.id, CONCAT(e.first_name, " ", e.last_name) AS "name" FROM employee e LEFT JOIN employee e2 ON e.id = e2.manager_id')
        } else {
            return this.connection.query('SELECT DISTINCT e.id, CONCAT(e.first_name, " ", e.last_name) AS "name" FROM employee e LEFT JOIN employee e2 ON e.id = e2.manager_id WHERE ?', {'e.role_id': role})
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