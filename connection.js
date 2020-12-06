const mysql = require('mysql');
const index = require('./index.js');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admin',
    database: 'employee_db'
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;