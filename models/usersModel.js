const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')

async function create(user) {
  try {
    const data = await client.insert(user).into('users').returning('*')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create user", 409)
  }
}

async function findUser(filter) {
  // console.log(filter)
  try {
    let query = client('users')

    const data = await query.modify(function (queryBuilder) {
      if (filter) {
        for (i in filter) {
          if (typeof filter[i] === 'object') {
            queryBuilder.where(
              filter[i].field,
              filter[i].operator,
              filter[i].value
            )
          } else {
            queryBuilder.where(i, filter[i])
          }
        }
        queryBuilder.orderBy('id')
      }
    })
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Fetch user!", 400)
  }
}

async function findEmployee(rfid) {
  try {
    const data = await client('users')
      .whereNot({
        department: 'hr',
      })
      .andWhere({
        rfid: rfid,
      })
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Fetch user!", 400)
  }
}

async function findLogs() {
  try {
    const users = await client('users')
      .select(
        'users.id',
        'users.fullname',
        'users.department',
        'users.role',
        'hr_employee_logs.id as employee_logs_id',
        'hr_employee_logs.log_date',
        'hr_employee_logs.time_in',
        'hr_employee_logs.time_out',
        client.raw(
          'CEIL(EXTRACT(EPOCH FROM (time_out - time_in))/3600) as totalhours'
        )
      )
      .leftJoin('hr_employee_logs', 'users.id', 'hr_employee_logs.employeeid')
      .orderBy('users.id')

    const usersWithLogs = []

    let currentUser

    for (const user of users) {
      if (!currentUser || currentUser.id !== user.id) {
        currentUser = {
          id: user.id,
          fullname: user.fullname,
          department: user.department,
          role: user.role,
          logs: [],
        }
        usersWithLogs.push(currentUser)
      }

      if (user.employee_logs_id) {
        currentUser.logs.push({
          totalhours: user.totalhours ? user.totalhours : 0,
          id: user.employee_logs_id,
          log_date: user.log_date,
          time_in: user.time_in,
          time_out: user.time_out,
        })
      }
    }
    return usersWithLogs
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Fetch user!", 400)
  }
}

async function update(id, user) {
  try {
    const data = client('users').where({ id: id }).update(user).returning('*')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Update user!", 400)
  }
}

async function archive(id) {
  try {
    const data = await client('users')
      .where({ id: id })
      .update({ active: 0 })
      .returning('*')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't archive user!", 400)
  }
}

async function unarchive(id) {
  try {
    const data = await client('users')
      .where({ id: id })
      .update({ active: 1 })
      .returning('*')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't unarchive user!", 400)
  }
}

async function createSchedule(schedule, id) {
  try {
    await client.raw('UPDATE users set schedule = ?::json WHERE id = ?', [
      schedule,
      id,
    ])
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create schedule!", 400)
  }
}

async function getEmployeeList() {
  try {
    const employess = await client('users')
      .select('users.*', 'hr_payroll.startdate', 'hr_payroll.enddate')
      .leftJoin('hr_payroll', 'users.id', 'hr_payroll.employeeid')
      .orderBy('users.id')

    return employess
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create schedule!", 400)
  }
}

module.exports = {
  create,
  findUser,
  findEmployee,
  getEmployeeList,
  update,
  findLogs,
  archive,
  createSchedule,
  unarchive,
}
