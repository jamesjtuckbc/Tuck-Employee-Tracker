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
    }).then(function (answer) {
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
                remove('dept');
                break;
            case 'Remove Role':
                remove('role');
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
};


async function employeeSelection(action) {
    inquirer.prompt({
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
                        updateEmployee(empChoices);
                        break;
                    case 'view':
                        const all = await db.getEmployee('nice')
                        console.log('\n');
                        console.table(all);
                        init();
                        break;
                    case 'remove':
                        removeEmployee(empChoices);
                        break;
                }
            case 'dept':
                const depts = await db.getDepartments();
                const deptChoices = depts.map(({ id, name }) => ({
                    name: name,
                    value: id
                }));
                inquirer.prompt(
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
                            updateEmployee(empChoices);
                            break;
                        case 'view':
                            const empDept = await db.getEmployee('dept', answer2.value);
                            console.log('\n');
                            console.table(empDept);
                            init();
                            break;
                        case 'remove':
                            removeEmployee(empChoices);
                            break;
                    }
                })
                break;
            case 'role':
                const roles = await db.getRoles();
                const roleChoices = roles.map(({ title, id }) => ({
                    name: title,
                    value: id
                }));
                inquirer.prompt(
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
                            updateEmployee(empChoices);
                            break;
                        case 'view':
                            const empRole = await db.getEmployee('role', answer2.value);
                            console.log('\n');
                            console.table(empRole);
                            init();
                            break;
                        case 'remove':
                            removeEmployee(empChoices);
                            break;
                    }
                })
                break;
            case 'mgr':
                const mgrs = await db.getManagers();
                const mgrChoices = mgrs.map(({ name, id }) => ({
                    name: name,
                    value: id
                }));
                inquirer.prompt(
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
                            updateEmployee(empChoices);
                            break;
                        case 'view':
                            const empMgr = await db.getEmployee('mgr', answer2.value);
                            console.log('\n');
                            console.table(empMgr);
                            init();
                            break;
                        case 'remove':
                            removeEmployee(empChoices);
                            break;
                    }
                })
                break;
            case 'salary':
                const salary = await db.getRoles();
                const salaryChoices = salary.map(({ salary, id }) => ({
                    name: salary,
                    value: id
                }));
                inquirer.prompt(
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
                            updateEmployee(empChoices);
                            break;
                        case 'view':
                            const empSalary = await db.getEmployee('salary', answer2.value);
                            console.log('\n');
                            console.table(empSalary);
                            init();
                            break;
                        case 'remove':
                            removeEmployee(empChoices);
                            break;
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
            init();
            break;
        case 'role':
            const role = await db.getRoles()
            console.log('\n');
            console.table(role);
            init();
            break;
    }
};

async function addEmployee() {
    const depts = await db.getDepartments();
    const deptChoices = depts.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    inquirer.prompt([{
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
        inquirer.prompt({
            name: 'role',
            type: 'list',
            message: 'Role?',
            choices: roleChoices
        }).then(async function (answer2) {
            const mgrs = await db.getManagers(answer2.role);
            const mgrChoices = mgrs.map(({ name, id }) => ({
                name: name,
                value: id
            }));
            inquirer.prompt({
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

function addDepartment() {
    inquirer.prompt({
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
    inquirer.prompt([{
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

function updateEmployee(empSelection) {
    inquirer.prompt([
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
                inquirer.prompt(
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
                inquirer.prompt(
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
                inquirer.prompt(
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
                inquirer.prompt({
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
                inquirer.prompt(
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
                init();
                break;
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
    inquirer.prompt([{
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
    inquirer.prompt([{
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

function removeEmployee(empSelection) {
    inquirer.prompt(
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

async function remove(table) {
    switch (table) {
        case 'dept':
            const dept = await db.getDepartments()
            const deptChoices = dept.map(({ id, name }) => ({
                name: name,
                value: id
            }));
            inquirer.prompt(
                {
                    name: 'value',
                    type: 'list',
                    message: 'Department to remove?',
                    choices: deptChoices,
                }
            ).then(async function (answer) {
                await db.delete('department', answer.value);
                console.log('\n' + 'Department Removed!' + '\n');
            })

            init();
            break;
        case 'role':
            const roles = await db.getRoles();
            const roleChoices = roles.map(({ title, id }) => ({
                name: title,
                value: id
            }));
            inquirer.prompt(
                {
                    name: 'value',
                    type: 'list',
                    message: 'Role to remove?',
                    choices: roleChoices,
                }
            ).then(async function (answer) {
                await db.delete('role', answer.value);
                console.log('\n' + 'Role Removed!' + '\n');
            });
            init();
            break;
    }
};
