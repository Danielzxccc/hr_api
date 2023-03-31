const fs = require('fs')
const path = require('path')

function logger(req, res, next) {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.path}`
  console.log(logMessage)
  fs.appendFile('logs.txt', logMessage + '\n', (err) => {
    if (err) {
      console.error(err)
    }
  })
  next()
}

module.exports = logger
