const mysql = require('mysql');
const connection = require('../connection.js');


class DB {
    constructor(connection) {
        this.connection = connection;
    }
    getRoles() {
        return this.connection.query('SELECT id, title, salary, department_id FROM role')
    }
    getDepartments() {
        return this.connection.query('SELECT id, name FROM department')
    }
    getManagers() {
        return this.connection.query('SELECT DISTINCT e.id, CONCAT(e.first_name, " ", e.last_name) AS "name" FROM employee e JOIN employee e2 ON e.id = e2.manager_id;')
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