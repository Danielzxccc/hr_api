function getTime() {
  let currentDate = new Date()

  let hours = currentDate.getHours()
  let minutes = currentDate.getMinutes()
  let seconds = currentDate.getSeconds()
  // format the time string with leading zeros
  let timeString = `${hours < 10 ? '0' : ''}${hours}:${
    minutes < 10 ? '0' : ''
  }${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  return timeString
}

function createDateObject(time) {
  const dateObject = new Date(`2000-01-01T${time}Z`)
  return dateObject
}

function getCurrentDay() {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const today = new Date().getDay()

  const currentDay = daysOfWeek[today]
  return currentDay
}

function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const date = year + '-' + month + '-' + day
  return date
}

module.exports = { getTime, createDateObject, getCurrentDay, getCurrentDate }
