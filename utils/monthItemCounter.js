function countValue(data, type) {
  let dataChart = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  }

  for (item of data) {
    const date = new Date(type === 'bar' ? item.log_date : item.paydate)
    const incrementor = type === 'bar' ? 1 : parseFloat(item.netpay)
    const month = date.getMonth()

    switch (month) {
      case 0:
        dataChart.January = dataChart.January + incrementor
      case 1:
        dataChart.February = dataChart.February + incrementor
        break
      case 2:
        dataChart.March = dataChart.March + incrementor
        break
      case 3:
        dataChart.April = dataChart.April + incrementor
        break
      case 4:
        dataChart.May = dataChart.May + incrementor
        break
      case 5:
        dataChart.June = dataChart.June + incrementor
        break
      case 6:
        dataChart.July = dataChart.July + incrementor
        break
      case 7:
        dataChart.August = dataChart.August + incrementor
        break
      case 8:
        dataChart.September = dataChart.September + incrementor
        break
      case 9:
        dataChart.October = dataChart.October + incrementor
        break
      case 10:
        dataChart.November = dataChart.November + incrementor
        break
      case 11:
        dataChart.December = dataChart.December + incrementor
        break
      default:
        break
    }
  }
  return dataChart
}

module.exports = { countValue }
