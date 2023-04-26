const client = require('../config/dbConfig')
const ErrorHandler = require('../helpers/errorHandler')
const { countValue } = require('../utils/monthItemCounter')

async function barchartData(id, year) {
  try {
    let query = client('hr_employee_logs').whereRaw(
      `EXTRACT(YEAR FROM log_date) = ${year}`
    )

    const data = await query.modify(function (queryBuilder) {
      if (id != 0) {
        queryBuilder.andWhere({ employeeid: id })
      }
    })

    return countValue(data, 'bar')
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch chart data", 409)
  }
}

async function lineChartData(id = 0, year = new Date().getFullYear()) {
  try {
    let query = client('hr_payroll').whereRaw(
      `EXTRACT(YEAR FROM paydate) = ${year}`
    )

    const data = await query.modify(function (queryBuilder) {
      if (id != 0) {
        queryBuilder.andWhere({ employeeid: id })
      }
    })

    return countValue(data, 'line')
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch chart data", 409)
  }
}

async function pieChartData() {
  try {
    const data = await client('users')

    let chartData = {
      sales: 0,
      hr: 0,
      warehouse: 0,
      purchasing: 0,
    }

    for (employees of data) {
      switch (employees.department) {
        case 'sales':
          chartData.sales = chartData.sales + 1
          break
        case 'hr':
          chartData.hr = chartData.hr + 1
          break
        case 'warehouse':
          chartData.warehouse = chartData.warehouse + 1
          break
        case 'purchasing':
          chartData.purchasing = chartData.purchasing + 1
          break
        default:
          break
      }
    }
    return chartData
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't fetch chart data", 409)
  }
}

async function summaryData() {
  try {
    const [attendance, totalEmployees, totalPayout] = await Promise.allSettled([
      client('hr_employee_logs').count('*').whereRaw('log_date = CURRENT_DATE'),
      client('users')
        .count('active')
        .where({ active: 1 })
        .orWhere({ active: 2 }),
      client('hr_payroll').sum('netpay'),
    ])
    return [attendance.value, totalEmployees.value, totalPayout.value]
  } catch (error) {
    throw new ErrorHandler(error.message || "Can't get summary data", 409)
  }
}

module.exports = { barchartData, summaryData, pieChartData, lineChartData }
