const backupModel = require('../models/backupModel')
const fs = require('fs')
const path = require('path')
const { getCurrentDate } = require('../utils/getCurrentTime')

async function getUsersRecords(req, res) {
  try {
    const data = await backupModel.getAllRecords('users')
    res.json(data)
  } catch (error) {
    res.status(error.httpCode || 500).json({
      error: true,
      message: error.message,
    })
  }
}

async function getUserLogsRecords(req, res) {
  try {
    const data = await backupModel.getAllRecords('hr_employee_logs')

    const jsonData = JSON.stringify(data)
    const backupFolder = path.join(__dirname, '..', 'backup/logs')

    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder)
    }

    const filePath = path.join(
      backupFolder,
      `${getCurrentDate()}userslogs.json`
    )

    const backupData = path.join(
      __dirname,
      '..',
      `backup/users/${getCurrentDate()}userslogs.json`
    )

    if (!fs.existsSync(backupData)) {
      fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log('File saved successfully:', filePath)
        }
      })
    }

    res.json(data)
  } catch (error) {
    res.status(error.httpCode || 500).json({
      error: true,
      message: "Can't fetch all logs",
    })
  }
}

async function getUserPayrolls(req, res) {
  try {
    const data = await backupModel.getAllRecords('hr_payroll')
    res.json(data)
  } catch (error) {
    res.status(error.httpCode || 500).json({
      error: true,
      message: "Can't fetch all payroll",
    })
  }
}

async function listFiles(req, res) {
  const table = req.query.table
  try {
    if (!table) return res.status(200).json({ files: [] })
    const directoryPath = path.join(__dirname, '..', `/backup/${table}`)
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res
          .status(500)
          .json({ error: true, message: 'Failed to read directory' })
      }
      res.status(200).json({ files })
    })
  } catch (error) {
    res.status(error.httpCode || 500).json({
      error: true,
      message: "Can't list user log files",
    })
  }
}

module.exports = {
  getUsersRecords,
  getUserLogsRecords,
  getUserPayrolls,
  listFiles,
}
