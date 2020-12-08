const connection = require('../connection.js');


class DB {
    constructor(connection) {
        this.connection = connection;
    }
    getRoles(dept) {
        if(dept == null) {
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name AS "department name", d.id AS "deptId" FROM role r LEFT JOIN department d ON r.department_id = d.id');
        } else if (dept === 'mappable'){
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name FROM role r LEFT JOIN department d ON r.department_id = d.id');
        } else {
            return this.connection.query('SELECT r.id, r.title, r.salary, d.name AS "department name" FROM role r LEFT JOIN department d ON r.department_id = d.id WHERE ?',{'d.id':dept});
        }
    }
    getRoleId(empId) {
        return this.connection.query('SELECT role_id FROM employee WHERE ?', {'id': empId});
    }
    getDepartments() {
        return this.connection.query('SELECT d.id, d.name, IFNULL(SUM(r2.salary),0) as "salary cost" FROM department d LEFT JOIN role r ON d.id = r.department_id LEFT JOIN employee e ON r.id = e.role_id LEFT JOIN role r2 ON e.role_id = r2.id GROUP BY d.id, d.name ORDER BY SUM(r.salary) DESC');
    }
    getManagers(role) {
        if(role == null){
            return this.connection.query('SELECT DISTINCT e.id, CONCAT(e.first_name, " ", e.last_name) AS "name" FROM employee e JOIN employee e2 ON e.id = e2.manager_id');
        } else {
            return this.connection.query('SELECT DISTINCT e.id, CONCAT(e.first_name, " ", e.last_name) AS "name" FROM employee e JOIN employee e2 ON e.id = e2.manager_id WHERE ?', {'e.role_id': role});
        }
    }
    getEmployee(by, value) {
        switch(by) {
            case 'nice':
                return this.connection.query(`SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id ORDER BY e.id ASC`);
            case 'all':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id ORDER BY e.id ASC`);
            case 'dept':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'d.id': value});
            case 'role':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'r.id': value});
            case 'mgr':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'e2.id': value});
            case 'mgrRole':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'e2.role_id': value});
            case 'mgrDept':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id JOIN role r2 on e2.role_id = r2.id WHERE ? ORDER BY e.id ASC`, {'r2.department_id': value});
            case 'salary':
                return this.connection.query(`SELECT e.id, e.first_name, e.last_name, r.title AS 'Title', d.name AS 'Department', r.salary AS 'Salary', CONCAT(e2.first_name, ' ', e2.last_name) AS 'Manager' FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee e2 ON e.manager_id = e2.id WHERE ? ORDER BY e.id ASC`, {'r.id': value});
        }
    }
    insertEmp(first, last, role, mgr) {
        return this.connection.query(`INSERT INTO employee SET ?`, { 'first_name': first, 'last_name': last, 'role_id': role, 'manager_id': mgr });
    }
    insertDept(name) {
        return this.connection.query(`INSERT INTO department SET ?`, { 'name': name });
    }
    insertRole(title, salary, dept) {
        return this.connection.query(`INSERT INTO role SET ?`, { 'title': title, 'salary': salary, 'department_id': dept });
    }
    updateEmp(by,first,last,role,mgr,id) {
        switch(by) {
            case 'Full Name':
                return this.connection.query('UPDATE employee SET ? WHERE ?', [{ 'first_name': first, 'last_name': last }, { 'id': id }]);
            case 'First Name':
                return this.connection.query('UPDATE employee SET ? WHERE ?', [{ 'first_name': first }, { 'id': id }]);
            case 'Last Name':
                return this.connection.query('UPDATE employee SET ? WHERE ?', [{ 'last_name': last }, { 'id': id }]);
            case 'Role, Department, and Salary':
                return this.connection.query('UPDATE employee SET ? WHERE ?', [{ 'role_id': role }, { 'id': id }]);
            case 'Manager':
                return this.connection.query('UPDATE employee SET ? WHERE ?', [{ 'manager_id':mgr }, { 'id': id }]);
            case 'MgrRole':
                return this.connection.query('UPDATE employee e JOIN employee e2 ON e.manager_id = e2.id SET ? WHERE ?', [{ 'e.manager_id':mgr }, { 'e2.role_id': id }]);
            case 'MgrDept':
                return this.connection.query('UPDATE employee e JOIN employee e2 ON e.manager_id = e2.id JOIN role r ON e2.role_id = r.id SET ? WHERE ?', [{ 'e.manager_id':mgr }, { 'r.department_id': id }]);
            case 'MgrNull':
                return this.connection.query('UPDATE employee e JOIN employee e2 ON e.manager_id = e2.id JOIN role r ON e2.role_id = r.id SET e.manager_id = NULL WHERE ?', { 'r.department_id': id });
        }
    }
    updateDept(name, id) {
        return this.connection.query('UPDATE department SET ? WHERE ?', [{ 'name': name }, { 'id': id }]);
    }
    updateRole(name, salary, id) {
        return this.connection.query('UPDATE role SET ? WHERE ?', [{ 'title': name, 'salary': salary }, { 'id': id }]);
    }
    updateRoleDept(newDept, oldDept) {
        return this.connection.query('UPDATE role SET ? WHERE ?', [{ 'department_id': newDept }, { 'department_id': oldDept }]);
    }
    updateEmpRole(newRole, oldDept) {
        return this.connection.query('UPDATE employee SET ? WHERE role_id IN (SELECT id FROM role WHERE ?)', [{ 'role_id': newRole }, { 'department_id': oldDept }]);
    }
    delete(table, id) {
        return this.connection.query(`DELETE FROM ${table} WHERE ?`, {'id': id});
    }
    deleteRoleDept(deptId) {
        return this.connection.query('DELETE FROM role WHERE ?', {'department_id': deptId});
    }
    deleteEmpRole(roleId) {
        return this.connection.query('DELETE FROM Employee WHERE ?', {'role_id':roleId});
    }
    deleteEmpDept(deptId) {
        return this.connection.query('DELETE e FROM Employee e JOIN role r ON e.role_id = r.id WHERE ?', {'r.department_id':deptId});
    }
    deleteEmpMgr(roleId) {
        return this.connection.query('DELETE e2 FROM employee e JOIN employee e2 ON e.manager_id = e2.id AND ?', {'e2.role_id':roleId});
    }
    async roleCount(dept) {
        const count = await this.connection.query('SELECT COUNT(*) AS COUNT FROM role WHERE ?',{'department_id': dept});
        if(count[0].COUNT > 0) {
            return true;
        } else {
            return false;
        }
    }
    async empCount(dept) {
        const count = await this.connection.query('SELECT COUNT(*) AS COUNT FROM employee e JOIN role r ON e.role_id = r.id WHERE ?',{'r.department_id': dept});
        if(count[0].COUNT > 0) {
            return true;
        } else {
            return false;
        }
    }
    async mgrCount(roleId) {
        const count = await this.connection.query('SELECT COUNT(*) AS COUNT FROM employee e JOIN employee e2 ON e.manager_id = e2.id AND ?', {'e2.role_id': roleId});
        if(count[0].COUNT > 0) {
            return true;
        } else {
            return false;
        }
    }
};


module.exports = new DB(connection);