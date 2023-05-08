const startDate = new Date('2023-05-07')
const endDate = new Date('2023-05-13')
const rangeStart = new Date('2023-05-10T16:00:00.000Z')
const rangeEnd = new Date('2023-05-11T16:00:00.000Z')
const datesInRange = []

for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
  if (date >= rangeStart && date <= rangeEnd) {
    const formattedDate = date.toISOString().split('T')[0]
    const dayOfWeek = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(date)
    datesInRange.push({ date: formattedDate, day: dayOfWeek })
  }
}

console.log(datesInRange)

const schedule = [
  {
    day: 'Monday',
    shift_timein: '13:00',
    shift_timeout: '21:00',
  },
  {
    day: 'Tuesday',
    shift_timein: '13:00',
    shift_timeout: '21:00',
  },
  {
    day: 'Wednesday',
    shift_timein: '13:00',
    shift_timeout: '21:00',
  },
  {
    day: 'Thursday',
    shift_timein: '13:00',
    shift_timeout: '21:00',
  },
  {
    day: 'Friday',
    shift_timein: '13:00',
    shift_timeout: '21:00',
  },
  {
    day: 'Saturday',
    shift_timein: '13:00',
    shift_timeout: '21:00',
  },
]

let totalHours = 0

for (const scheduleItem of schedule) {
  for (const dateItem of datesInRange) {
    if (scheduleItem.day === dateItem.day) {
      const shiftStart = new Date(
        `${dateItem.date} ${scheduleItem.shift_timein}`
      )
      const shiftEnd = new Date(
        `${dateItem.date} ${scheduleItem.shift_timeout}`
      )
      const durationMs = shiftEnd - shiftStart
      const durationHours = durationMs / (1000 * 60 * 60)
      totalHours += durationHours
    }
  }
}

console.log(`Total leave duration: ${totalHours.toFixed(2)} hours`)
