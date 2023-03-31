// const fs = require('fs')

// // Example JSON data
// const jsonData =
//   '[{"id": 1, "name": "John", "age": 30}, {"id": 2, "name": "Jane", "age": 25}]'

// // Parse the JSON data to a JavaScript object
// const data = JSON.parse(jsonData)

// // Get the headers from the first object
// const headers = Object.keys(data[0])

// // Create an array of arrays containing the data
// const csvData = [
//   headers, // Header row
//   ...data.map((obj) => headers.map((header) => obj[header])), // Data rows
// ]

// // Convert the array of arrays to a CSV string
// const csvString = csvData.map((row) => row.join(',')).join('\n')

// // Write the CSV data to a file
// fs.writeFile('data.csv', csvString, (err) => {
//   if (err) {
//     console.error(err)
//   } else {
//     console.log('File saved successfully.')
//   }
// })c

const jsonString =
  '["{"day": "Sunday", "shift_timein": "13:00", "shift_timeout": "17:00"}","{"day": "Tuesday", "shift_timein": "13:00", "shift_timeout": "17:00"}","{"day": "Wednesday", "shift_timein": "13:00", "shift_timeout": "17:00"}","{"day": "Saturday", "shift_timein": "13:00", "shift_timeout": "17:00"}","{"day": "Monday", "shift_timein": "13:00", "shift_timeout": "17:00"}"]'

const jsonArray = JSON.parse(jsonString)
console.log(jsonArray)
