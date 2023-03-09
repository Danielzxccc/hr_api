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
module.exports = { getTime, createDateObject }
