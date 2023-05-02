const payrollModel = require('../models/payrollModel')
const { findUser } = require('../models/usersModel')
const { getCurrentDay } = require('../utils/getCurrentTime')
require('dotenv').config()

function generateTimeStamp(timeString) {
  const dateObj = new Date()
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const isoTimestamp = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}T${timeString}:00.000Z`
  return isoTimestamp
}

function decrementTime(timeString) {
  const dateObj = new Date()
  dateObj.setHours(parseInt(timeString.split(':')[0]) - 2)
  const hour = dateObj.getHours()
  const minute = dateObj.getMinutes()
  const resultTimeString = `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`
  return resultTimeString
}

async function adjustTimeout() {
  try {
    const employeesWithNoTimeout = await payrollModel.getEmployeeWithNoTimeout()

    for (logs of employeesWithNoTimeout) {
      const schedule = await findUser({ id: logs.employeeid })
      const currentDay = getCurrentDay()

      const dayofLog = schedule[0].schedule.find(
        (item) => item.day === currentDay
      )

      const decrementedTime = decrementTime(dayofLog.shift_timeout)
      const isoTimeStamp = generateTimeStamp(decrementedTime)

      await payrollModel.adjustTimeout(logs.id, isoTimeStamp)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { adjustTimeout }
