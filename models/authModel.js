const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')

async function findUsername(username) {
  try {
    const data = await client('users')
      .where({ username: username })
      .andWhere({ department: 'hr' })
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Fetch user!", 400)
  }
}

module.exports = { findUsername }
