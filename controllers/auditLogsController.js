const { getAllLogs } = require('../models/auditLogsModel')

async function findAll(req, res) {
  try {
    const data = await getAllLogs()
    res.status(200).json(data)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

module.exports = { findAll }
