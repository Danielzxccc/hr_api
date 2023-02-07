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
      }
    })
    return data
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't Fetch user!", 400)
  }
}

module.exports = { create, findUser }
