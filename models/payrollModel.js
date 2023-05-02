const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')

async function create(payroll) {
  try {
    const data = await client.insert(payroll).into('hr_payroll').returning('*')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create payroll", 409)
  }
}

async function findAll() {
  try {
    const data = await client('hr_payroll')
      .select(
        'users.fullname',
        'users.department',
        'users.role',
        'hr_payroll.*'
      )
      .leftJoin('users', 'users.id', 'hr_payroll.employeeid')

    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch payroll", 409)
  }
}

async function findOne(id) {
  try {
    const data = await client('hr_payroll').where({ employeeid: id })
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch payroll", 409)
  }
}

async function findPayroll(id) {
  try {
    const data = await client('hr_payroll')
      .select(
        'users.fullname',
        'users.contact',
        'users.address',
        'users.email',
        'hr_payroll.*',
        'hr_employee_logs.id as employee_logs_id',
        'hr_employee_logs.log_date',
        'hr_employee_logs.time_in',
        'hr_employee_logs.time_out',
        client.raw(
          'ROUND(EXTRACT(EPOCH FROM (time_out - time_in))/3600) as totalhours'
        )
      )
      .join('users', 'users.id', 'hr_payroll.employeeid')
      .join(
        'hr_employee_logs',
        'hr_employee_logs.employeeid',
        'hr_payroll.employeeid'
      )
      .where('hr_payroll.id', id)
      .orderBy('hr_employee_logs.log_date', 'DESC')

    const usersWithLogs = []

    let currentUser

    for (const user of data) {
      if (!currentUser || currentUser.id !== user.id) {
        currentUser = {
          ...user,
          logs: [],
        }
        usersWithLogs.push(currentUser)
      }

      if (user.employee_logs_id) {
        currentUser.logs.push({
          totalhours: user.totalhours ? user.totalhours : 0,
          log_date: user.log_date,
          time_in: user.time_in,
          time_out: user.time_out,
        })
      }
    }

    return usersWithLogs
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch payroll", 409)
  }
}

async function getEmployeeWithNoTimeout() {
  try {
    const data = await client('hr_employee_logs').whereRaw('time_out IS NULL')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch payroll", 409)
  }
}

async function adjustTimeout(id, timestamp) {
  try {
    await client('hr_employee_logs')
      .where({ id: id })
      .update({ time_out: timestamp })
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch payroll", 409)
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  findPayroll,
  getEmployeeWithNoTimeout,
  adjustTimeout,
}
