const reportsModel = require('../models/reportsModel')

async function getSummaryData(req, res) {
  try {
    const [attendance, totalEmployees, totalPayout] =
      await reportsModel.summaryData()

    res.status(200).json({ attendance, totalEmployees, totalPayout })
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function getBarChartData(req, res) {
  try {
    const { employee, year } = req.query
    const data = await reportsModel.barchartData(employee, year)
    res.status(200).json(data)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function getPieChartData(req, res) {
  try {
    const data = await reportsModel.pieChartData()
    res.status(200).json(data)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function getLineChartData(req, res) {
  try {
    const { employee, year } = req.query
    const data = await reportsModel.lineChartData(employee, year)
    res.status(200).json(data)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

module.exports = {
  getBarChartData,
  getSummaryData,
  getPieChartData,
  getLineChartData,
}
