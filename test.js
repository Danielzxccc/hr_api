const time = require('./utils/getCurrentTime')

const timestamp = '2023-03-10T23:12:20.300Z'
const date = new Date(timestamp)
const hours = date.getUTCHours().toString().padStart(2, '0')
const minutes = date.getUTCMinutes().toString().padStart(2, '0')
const seconds = date.getUTCSeconds().toString().padStart(2, '0')
const timeString = `${hours}:${minutes}:${seconds}`
console.log(`The time is ${timeString}`)

const date1 = '18:00:00'

const minus =
  (time.createDateObject(time.getTime()) - time.createDateObject(date1)) /
  3600000

console.log(Math.ceil(minus))
