const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')

async function getAllRecords(table) {
  try {
    const data = await client.select('*').from(table)
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || 'error fetching records', 500)
  }
}

module.exports = { getAllRecords }
