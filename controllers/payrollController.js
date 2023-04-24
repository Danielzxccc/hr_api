const { createLog } = require('../models/auditLogsModel')
const payrollModel = require('../models/payrollModel')
const { getCurrentFormat } = require('../utils/getCurrentTime')

async function createPayroll(req, res) {
  try {
    const insertPayroll = await payrollModel.create(req.body)
    await createLog({
      employeeid: req.session.user[0].id ? req.session.user[0].id : 0,
      activity: `${req.session.user[0].fullname} created a payroll`,
      created_at: getCurrentFormat(),
    })
    res
      .status(201)
      .json({ message: 'Created Successfully', data: insertPayroll })
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

async function getAllPayroll(req, res) {
  try {
    const query = await payrollModel.findAll()
    res.status(200).json(query)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

// get payroll by employeeid
async function getOnePayroll(req, res) {
  try {
    const id = req.params.id
    const query = await payrollModel.findOne(id)
    res.status(200).json(query)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}
// get payroll by id
async function getPayrollById(req, res) {
  try {
    const id = req.params.id
    const query = await payrollModel.findPayroll(id)
    res.status(200).json(query)
  } catch (error) {
    res
      .status(error.httpCode || 400)
      .json({ error: true, message: error.message })
  }
}

module.exports = { createPayroll, getAllPayroll, getOnePayroll, getPayrollById }
