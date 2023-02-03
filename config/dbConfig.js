const client = require('knex')({
  client: 'pg',
  connection: process.env.CONNECTION_URI,
  ssl: true,
})

module.exports = client
