const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')

async function createLog(id) {
  try {
    const data = await client
      .insert({
        employeeid: id,
      })
      .into('hr_employee_logs')
      .returning('*')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create log", 409)
  }
}

async function checkDay(id) {
  try {
    const data = await client.raw(
      'SELECT * FROM hr_employee_logs WHERE log_date = CURRENT_DATE AND employeeid = ?',
      [id]
    )
    return data.rows
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create log", 401)
  }
}

module.exports = { createLog, checkDay }
