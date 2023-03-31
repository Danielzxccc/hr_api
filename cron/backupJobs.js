const backupModel = require('../models/backupModel')
const fs = require('fs')
const path = require('path')
const { getCurrentDate } = require('../utils/getCurrentTime')
async function backupLogs() {
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
      `backup/logs/${getCurrentDate()}userslogs.json`
    )

    if (!fs.existsSync(backupData)) {
      fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log('File saved successfully:', filePath)
        }
      })
    } else {
      console.log('Backup is done for this month')
    }
  } catch (error) {
    console.log(error.message)
  }
}
module.exports = { backupLogs }
