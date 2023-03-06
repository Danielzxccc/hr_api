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

async function checkTime(id) {
  try {
    const currentTime = new Date()
    const options = {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }

    const data = await client('hr_schedule')
      .where(
        'shift_timein',
        '<=',
        currentTime.toLocaleTimeString('en-US', options)
        // '11:00:00'
      )
      .andWhere(
        'shift_timeout',
        '>=',
        currentTime.toLocaleTimeString('en-US', options)
        // '11:00:00'
      )
      .andWhere('employeeid', id)
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't find time", 401)
  }
}
module.exports = { createLog, checkDay, checkTime }
