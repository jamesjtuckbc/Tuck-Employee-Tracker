const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./connection.js');
const db = require('./db/db.js');

init();

async function init() {
    await inquirer.prompt({
        name: 'initQuestion',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View Employees',
            'View Departments',
            'View Roles',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Update Employees',
            'Update Department',
            'Update Role',
            'Remove Employee',
            'Remove Department',
            'Remove Role',
            'Exit'
        ]
    }).then(async function (answer) {
        switch (answer.initQuestion) {
            case 'View Employees':
                employeeSelection('view');
                break;
            case 'View Departments':
                view('dept');
                break;
            case 'View Roles':
                view('role');
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employees':
                employeeSelection('update');
                break;
            case 'Update Department':
                updateDepartment();
                break;
            case 'Update Role':
                updateRole();
                break;
            case 'Remove Employee':
                employeeSelection('remove');
                break;
            case 'Remove Department':
                removeRoleOrDept('dept');
                break;
            case 'Remove Role':
                removeRoleOrDept('role');
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
};


async function employeeSelection(action) {
    await inquirer.prompt({
        name: 'find',
        type: 'list',
        message: `Find Employee to ${action} by:`,
        choices: [
            { name: 'All Employees', value: 'all' },
            { name: 'Employees by Department', value: 'dept' },
            { name: 'Employees by Role', value: 'role' },
            { name: 'Employees by Manager', value: 'mgr' },
            { name: 'Employees by Salary', value: 'salary' },
        ]
    }).then(async function (answer) {
        switch (answer.find) {
            case 'all':
                const emp = await db.getEmployee(answer.find);
                const empChoices = emp.map(({ id, first_name, last_name }) => ({
                    name: first_name.concat(' ', last_name),
                    value: id
                }));
                switch (action) {
                    case 'update':
                        await updateEmployee(empChoices);
                        return;
                    case 'view':
                        const all = await db.getEmployee('nice')
                        console.log('\n');
                        console.table(all);
                        return init();
                    case 'remove':
                        await removeEmployee(empChoices);
                        return;
                }
            case 'dept':
                const depts = await db.getDepartments();
                const deptChoices = depts.map(({ id, name }) => ({
                    name: name,
                    value: id
                }));
                await inquirer.prompt(
                    {
                        name: 'value',
                        type: 'list',
                        message: 'Department?',
                        choices: deptChoices,
                    }
                ).then(async function (answer2) {
                    const emp = await db.getEmployee(answer.find, answer2.value);
                    const empChoices = emp.map(({ id, first_name, last_name }) => ({
                        name: first_name.concat(' ', last_name),
                        value: id
                    }));
                    switch (action) {
                        case 'update':
                            await updateEmployee(empChoices);
                            return;
                        case 'view':
                            const empDept = await db.getEmployee('dept', answer2.value);
                            console.log('\n');
                            console.table(empDept);
                            return init();
                        case 'remove':
                            await removeEmployee(empChoices);
                            return;
                    }
                })
                break;
            case 'role':
                const roles = await db.getRoles();
                const roleChoices = roles.map(({ title, id }) => ({
                    name: title,
                    value: id
                }));
                await inquirer.prompt(
                    {
                        name: 'value',
                        type: 'list',
                        message: 'Role?',
                        choices: roleChoices,
                    }
                ).then(async function (answer2) {
                    const emp = await db.getEmployee(answer.find, answer2.value);
                    const empChoices = emp.map(({ id, first_name, last_name }) => ({
                        name: first_name.concat(' ', last_name),
                        value: id
                    }));
                    switch (action) {
                        case 'update':
                            await updateEmployee(empChoices);
                            return;
                        case 'view':
                            const empRole = await db.getEmployee('role', answer2.value);
                            console.log('\n');
                            console.table(empRole);
                            return init();
                        case 'remove':
                            await removeEmployee(empChoices);
                            return;
                    }
                })
                break;
            case 'mgr':
                const mgrs = await db.getManagers();
                const mgrChoices = mgrs.map(({ name, id }) => ({
                    name: name,
                    value: id
                }));
                await inquirer.prompt(
                    {
                        name: 'value',
                        type: 'list',
                        message: 'Manager?',
                        choices: mgrChoices,
                    }
                ).then(async function (answer2) {
                    const emp = await db.getEmployee(answer.find, answer2.value);
                    const empChoices = emp.map(({ id, first_name, last_name }) => ({
                        name: first_name.concat(' ', last_name),
                        value: id
                    }));
                    switch (action) {
                        case 'update':
                            await updateEmployee(empChoices);
                            return;
                        case 'view':
                            const empMgr = await db.getEmployee('mgr', answer2.value);
                            console.log('\n');
                            console.table(empMgr);
                            return init();
                        case 'remove':
                            await removeEmployee(empChoices);
                            return;
                    }
                })
                break;
            case 'salary':
                const salary = await db.getRoles();
                const salaryChoices = salary.map(({ salary, id }) => ({
                    name: salary,
                    value: id
                }));
                await inquirer.prompt(
                    {
                        name: 'value',
                        type: 'list',
                        message: 'Salary?',
                        choices: salaryChoices,
                    }
                ).then(async function (answer2) {
                    const emp = await db.getEmployee(answer.find, answer2.value);
                    const empChoices = emp.map(({ id, first_name, last_name }) => ({
                        name: first_name.concat(' ', last_name),
                        value: id
                    }));
                    switch (action) {
                        case 'update':
                            await updateEmployee(empChoices);
                            return;
                        case 'view':
                            const empSalary = await db.getEmployee('salary', answer2.value);
                            console.log('\n');
                            console.table(empSalary);
                            return init();
                        case 'remove':
                            await removeEmployee(empChoices);
                            return;
                    }
                })
                break;
        }
    })
};



async function view(table) {
    switch (table) {
        case 'dept':
            const dept = await db.getDepartments()
            console.log('\n');
            console.table(dept);
            return init();
        case 'role':
            const role = await db.getRoles()
            console.log('\n');
            console.table(role);
            return init();
    }
};

async function addEmployee() {
    const depts = await db.getDepartments();
    const deptChoices = depts.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    await inquirer.prompt([{
        name: 'firstName',
        type: 'input',
        message: 'First name?',
    },
    {
        name: 'lastName',
        type: 'input',
        message: 'Last name?',
    },
    {
        name: 'dept',
        type: 'list',
        message: 'Department?',
        choices: deptChoices,
    }]).then(async function (answer) {
        const roles = await db.getRoles(answer.dept);
        const roleChoices = roles.map(({ title, id }) => ({
            name: title,
            value: id
        }));
        await inquirer.prompt({
            name: 'role',
            type: 'list',
            message: 'Role?',
            choices: roleChoices
        }).then(async function (answer2) {
            const mgrs = await db.getEmployee('all');
            const mgrChoices = mgrs.map(({ id, first_name, last_name }) => ({
                name: first_name.concat(' ', last_name),
                value: id
            }));
            await inquirer.prompt({
                name: 'mgr',
                type: 'list',
                message: 'Manager?',
                choices: mgrChoices
            }).then(async function (answer3) {
                await db.insertEmp(answer.firstName, answer.lastName, answer2.role, answer3.mgr)
                console.log('\n' + 'New employee added!' + '\n');
                init();
            })
        });
    })
};

async function addDepartment() {
    await inquirer.prompt({
        name: 'dept',
        type: 'input',
        message: 'Department name?',
    }).then(async function (answer) {
        await db.insertDept(answer.dept);
        console.log('\n' + 'New Department added!' + '\n');
        init();
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
    await inquirer.prompt([{
        name: 'dept',
        type: 'list',
        message: 'Department?',
        choices: deptChoices,
    },
    {
        name: 'title',
        type: 'input',
        message: 'Role name?',
    },
    {
        name: 'salary',
        type: 'input',
        message: 'Salary?',
        validate: (salary) => valSalary(salary)

    }]).then(async function (answer) {
        await db.insertRole(answer.title, answer.salary, answer.dept);
        console.log('\n' + 'New Role added!' + '\n');
        init();
    })
};

async function updateEmployee(empSelection) {
    await inquirer.prompt([
        {
            name: 'emp',
            type: 'list',
            message: 'Choose Employee to update',
            choices: empSelection
        },
        {
            name: 'update',
            type: 'list',
            message: 'What would you like to update?',
            choices: [
                'Full Name',
                'First Name',
                'Last Name',
                'Role, Department, and Salary',
                'Manager',
                'Back',
                'Exit',
            ]
        }
    ]).then(async function (answer) {
        switch (answer.update) {
            case 'Full Name':
                await inquirer.prompt(
                    [
                        {
                            name: 'firstName',
                            type: 'input',
                            message: 'First name?',
                        },
                        {
                            name: 'lastName',
                            type: 'input',
                            message: 'Last name?',
                        }
                    ]
                ).then(async function (answer2) {
                    await db.updateEmp(answer.update, answer2.firstName, answer2.lastName, answer2.role, answer2.mgr, answer.emp);
                    console.log('\n' + `Employee's full name updated!` + '\n');
                    init();
                })
                break;
            case 'First Name':
                await inquirer.prompt(
                    {
                        name: 'firstName',
                        type: 'input',
                        message: 'First name?',
                    }
                ).then(async function (answer2) {
                    await db.updateEmp(answer.update, answer2.firstName, answer2.lastName, answer2.role, answer2.mgr, answer.emp);
                    console.log('\n' + `Employee's first name updated!` + '\n');
                    init();
                })
                break;
            case 'Last Name':
                await inquirer.prompt(
                    {
                        name: 'lastName',
                        type: 'input',
                        message: 'Last name?',
                    }
                ).then(async function (answer2) {
                    await db.updateEmp(answer.update, answer2.firstName, answer2.lastName, answer2.role, answer2.mgr, answer.emp);
                    console.log('\n' + `Employee's last name updated!` + '\n');
                    init();
                })
                break;
            case 'Role, Department, and Salary':
                const roles = await db.getRoles('mappable');
                const roleChoices = roles.map(({ title, id, name, salary }) => ({
                    name: title.concat(', ', name, ', ', salary),
                    value: id
                }));
                await inquirer.prompt({
                    name: 'role',
                    type: 'list',
                    message: 'Role?',
                    choices: roleChoices
                }
                ).then(async function (answer2) {
                    await db.updateEmp(answer.update, answer2.firstName, answer2.lastName, answer2.role, answer2.mgr, answer.emp);
                    console.log('\n' + `Employee's Role updated!` + '\n');
                    init();
                })
                break;
            case 'Manager':
                const mgr = await db.getEmployee('all');
                const mgrChoices = mgr.map(({ id, first_name, last_name }) => ({
                    name: first_name.concat(' ', last_name),
                    value: id
                }));
                await inquirer.prompt(
                    {
                        name: 'mgr',
                        type: 'list',
                        message: 'Manager?',
                        choices: mgrChoices,
                    }
                ).then(async function (answer2) {
                    await db.updateEmp(answer.update, answer2.firstName, answer2.lastName, answer2.role, answer2.mgr, answer.emp);
                    console.log('\n' + `Employee's Manager updated!` + '\n');
                    init();
                })
                break;
            case 'Back':
                return init();
            case 'Exit':
                connection.end();
                break;
        }
    })
}

async function updateDepartment() {
    const depts = await db.getDepartments();
    const deptChoices = depts.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    await inquirer.prompt([{
        name: 'dept',
        type: 'list',
        message: 'Department to update?',
        choices: deptChoices,
    },
    {
        name: 'deptName',
        type: 'input',
        message: 'New Department name?',
    }]).then(async function (answer) {
        await db.updateDept(answer.deptName, answer.dept);
        console.log('\n' + 'Department Updated!' + '\n');
        init();
    })
};

async function updateRole() {
    const roles = await db.getRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    await inquirer.prompt([{
        name: 'role',
        type: 'list',
        message: 'Role to update?',
        choices: roleChoices,
    },
    {
        name: 'roleName',
        type: 'input',
        message: 'New Role name?',
    }]).then(async function (answer) {
        await db.updateRole(answer.roleName, answer.role);
        console.log('\n' + 'Role Updated!' + '\n');
        init();
    })
};

async function removeEmployee(empSelection) {
    await inquirer.prompt(
        {
            name: 'emp',
            type: 'list',
            message: 'Choose Employee to remove',
            choices: empSelection
        }).then(async function (answer) {
            await db.delete('employee', answer.emp);
            console.log('\n' + 'Employee Removed!' + '\n');
            init();
        })
};

async function removeRoleOrDept(table) {
    switch (table) {
        case 'dept':
            const dept = await db.getDepartments()
            const deptChoices = dept.map(({ id, name }) => ({
                name: name,
                value: id
            }));
            await inquirer.prompt(
                {
                    name: 'value',
                    type: 'list',
                    message: 'Department to remove?',
                    choices: deptChoices,
                }
            ).then(async function (answer) {
                const id = answer.value;
                await removeDept(id, deptChoices);
            })
            break;
        case 'role':
            const roles = await db.getRoles();
            const roleChoices = roles.map(({ title, deptId }) => ({
                name: title,
                value: deptId
            }));
            await inquirer.prompt(
                {
                    name: 'value',
                    type: 'list',
                    message: 'Role to remove?',
                    choices: roleChoices,
                }
            ).then(async function (answer) {
                const id = answer.value;
                await removeRole(id, roleChoices);
            });
            break;
    }
};

async function removeDept(id, deptChoices) {
    const hasRoles = await db.roleCount(id)
    if (hasRoles) {
        console.log('Has Roles');
        const roles = await db.getRoles(id);
        const roleChoices = roles.map(({ title, id }) => ({
            name: title,
            value: id
        }));
        console.log('\n' + 'These roles need to be moved to a new department or removed' + '\n');
        console.table(roles);
        await inquirer.prompt(
            {
                name: 'action',
                type: 'list',
                message: 'Update or Remove roles?',
                choices: [
                    'Update',
                    'Remove'
                ]
            }).then(async function (answer) {
                switch (answer.action) {
                    case 'Update':
                        await inquirer.prompt(
                            {
                                name: 'value',
                                type: 'list',
                                message: 'New Department for these roles?',
                                choices: deptChoices,
                            }
                        ).then(async function (answer4) {
                            await db.updateRoleDept(answer4.value);
                            console.log('\n' + 'Roles Updated!' + '\n');
                            await db.delete('department', id);
                            console.log('\n' + 'Department Removed!' + '\n');
                            init();
                        })
                        break;
                    case 'Remove':
                        await removeRoleDept(id, roleChoices);
                        await db.delete('department', id);
                        console.log('\n' + 'Department Removed!' + '\n');
                        break;
                }
            })

    } else {
        await db.delete('department', id);
        console.log('\n' + 'Department Removed!' + '\n');
        init();
    }
}

async function removeRoleDept(deptId, roleChoices) {
    const hasEmp = await db.empCount(deptId);
    if (hasEmp) {
        const roles = await db.getEmployee('dept', deptId);
        console.log('\n' + 'These employees need to be moved to a new role or removed' + '\n');
        console.table(roles);
        await inquirer.prompt(
            {
                name: 'action',
                type: 'list',
                message: 'Update or Remove employees?',
                choices: [
                    'Update',
                    'Remove'
                ]
            }).then(async function (answer) {
                switch (answer.action) {
                    case 'Update':
                        await inquirer.prompt(
                            {
                                name: 'value',
                                type: 'list',
                                message: 'New Role for these employees?',
                                choices: roleChoices,
                            }
                        ).then(async function (answer4) {
                            await db.updateEmpRole(answer4.value);
                            console.log('\n' + 'Employees Updated!' + '\n');
                            await db.deleteRoleDept(deptId);
                            console.log('\n' + 'Role Removed!' + '\n');
                            init();
                        })
                        break;
                    case 'Remove':
                        await db.updateEmp('MgrNull','','','','',deptId);
                        await removeEmpDept(deptId);
                        await db.deleteRoleDept(deptId);
                        console.log('\n' + 'Role Removed!' + '\n');
                        break;
                }
            })
    } else {
        await db.deleteRoleDept(deptId);
        console.log('\n' + 'Role Removed!' + '\n');
        init();
    }
};

async function removeRole(roleId, roleChoices) {
    const hasEmp = await db.empCount(roleId);
    if (hasEmp) {
        const roles = await db.getEmployee('role', roleId);
        console.log('\n' + 'These employees need to be moved to a new role or removed' + '\n');
        console.table(roles);
        await inquirer.prompt(
            {
                name: 'action',
                type: 'list',
                message: 'Update or Remove?',
                choices: [
                    'Update',
                    'Remove'
                ]
            }).then(async function (answer) {
                switch (answer.action) {
                    case 'Update':
                        await inquirer.prompt(
                            {
                                name: 'value',
                                type: 'list',
                                message: 'New Role for these employees?',
                                choices: roleChoices,
                            }
                        ).then(async function (answer4) {
                            await db.updateEmpRole(answer4.value);
                            console.log('\n' + 'Employees Updated!' + '\n');
                            await db.delete('role',roleId);
                            console.log('\n' + 'Role Removed!' + '\n');
                            init();
                        })
                        break;
                    case 'Remove':
                        await removeEmp(roleId);
                        await db.delete('role',roleId);
                        console.log('\n' + 'Role Removed!' + '\n');
                        break;
                }
            })
    } else {
        await db.delete('role',roleId);
        console.log('\n' + 'Role Removed!' + '\n');
        init();
    }
};

async function removeEmp(roleId) {
    const hasMgr = await db.mgrCount(roleId);
    if (hasMgr) {
        const emp = await db.getEmployee('mgrRole', roleId);
        console.log('\n' + 'These Employees have a Manager you are trying to delete' + '\n');
        console.table(emp);
        const employees = await db.getEmployee('all')
        const mgrChoices = employees.map(({ id, first_name, last_name }) => ({
            name: first_name.concat(' ', last_name),
            value: id
        }));
        await inquirer.prompt(
            {
                name: 'value',
                type: 'list',
                message: 'New Manager for these employees?',
                choices: mgrChoices,
            }
        ).then(async function (answer4) {
            await db.updateEmp('MgrRole', '', '', '', answer4.value, roleId);
            console.log('\n' + 'Employees Updated!' + '\n');
            await db.deleteEmpRole(roleId);
            console.log('\n' + 'Employees Removed' + '\n');
            init();
        })
    } else {
        await db.deleteEmpRole(roleId);
        console.log('\n' + 'Employees Removed' + '\n');
        init();
    }

};

async function removeEmpDept(deptId) {
    const hasMgr = await db.mgrCount(deptId);
    if (hasMgr) {
        const emp = await db.getEmployee('mgrDept', deptId);
        console.log('\n' + 'These Employees have a Manager you are trying to delete' + '\n');
        console.table(emp);
        const employees = await db.getEmployee('all')
        const mgrChoices = employees.map(({ id, first_name, last_name }) => ({
            name: first_name.concat(' ', last_name),
            value: id
        }));
        await inquirer.prompt(
            {
                name: 'value',
                type: 'list',
                message: 'New Manager for these employees?',
                choices: mgrChoices,
            }
        ).then(async function (answer4) {
            await db.updateEmp('MgrDept', '', '', '', answer4.value, deptId);
            console.log('\n' + 'Employees Updated!' + '\n');
            await db.deleteEmpDept(deptId);
            console.log('\n' + 'Employees Removed' + '\n');
            init();
        })
    } else {
        await db.deleteEmpDept(deptId);
        console.log('\n' + 'Employees Removed' + '\n');
        init();
    }
};