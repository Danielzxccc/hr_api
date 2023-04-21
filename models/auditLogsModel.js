const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')

async function createLog(payroll) {
  try {
    const data = await client
      .insert(payroll)
      .into('hr_audit_logs')
      .returning('*')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't create log", 409)
  }
}

module.exports = { createLog }
