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
    const data = await client.select().from('hr_payroll')
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

module.exports = { create, findAll, findOne }
