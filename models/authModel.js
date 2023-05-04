const client = require('../config/dbConfig')
const { getTime } = require('../utils/getCurrentTime')
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
    throw new ErrorHandler(error.message || "Can't create log", 500)
  }
}
// for hr employees
async function checkAttendance(id) {
  try {
    const data = await client.raw(
      'SELECT * FROM hr_employee_logs WHERE log_date = CURRENT_DATE AND employeeid = ?',
      [id]
    )
    return data.rows
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch log", 500)
  }
}
// for employees outside hr
async function checkDay(id) {
  try {
    const data = await client.raw(
      'SELECT * FROM hr_employee_logs WHERE log_date = CURRENT_DATE AND employeeid = ?',
      [id]
    )
    return data.rows
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create log", 500)
  }
}

async function findTimeIn(id) {
  try {
    const data = await client('hr_employee_logs')
      .whereRaw('log_date = CURRENT_DATE')
      .andWhere({ employeeid: id })
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't find timed in", 500)
  }
}

async function addTimeOut(id, overtime = 0) {
  try {
    await client.raw(
      'UPDATE hr_employee_logs SET time_out = CURRENT_TIMESTAMP, overtime = ? WHERE log_date = CURRENT_DATE AND employeeid = ?',
      [overtime, id]
    )
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't add timed out", 500)
  }
}

module.exports = {
  createLog,
  checkDay,
  findTimeIn,
  addTimeOut,
  checkAttendance,
}
