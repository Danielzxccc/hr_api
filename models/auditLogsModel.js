const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')

async function createLog(payroll) {
  try {
    await client.insert(payroll).into('hr_audit_logs')
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create log", 409)
  }
}

async function getAllLogs() {
  try {
    const data = await client('hr_audit_logs')
      .select(
        'hr_audit_logs.*',
        'users.fullname',
        client.raw(
          "CONCAT(users.fullname, ' ', hr_audit_logs.activity) as log_activity"
        )
      )
      .leftJoin('users', 'hr_audit_logs.employeeid', 'users.id')
      .orderBy('hr_audit_logs.id', 'DESC')
      .limit(200)
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create fetch", 500)
  }
}

module.exports = { createLog, getAllLogs }
