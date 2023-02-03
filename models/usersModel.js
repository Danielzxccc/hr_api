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

async function findAll() {
  try {
    const data = await client.select().from('users')
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Fetch user!", 400)
  }
}

async function findOne(field, value) {
  try {
    const userObject = { field: value }

    Object.defineProperty(
      userObject,
      `${field}`,
      Object.getOwnPropertyDescriptor(userObject, 'field')
    )
    delete userObject['field']

    const data = await client.select().from('users').where(userObject)
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Fetch Comments!", 404)
  }
}

module.exports = { create, findAll, findOne }
